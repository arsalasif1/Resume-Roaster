import express from "express";
import path from "path";
import dotenv from "dotenv";
import * as pdf from "pdf-parse";
import * as mammoth from "mammoth";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase JSON body limit to handle base64 files
app.use(express.json({ limit: "15mb" }));

// Initialize Gemini SDK lazily to ensure robust startup when API key is missing
let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required but was not found.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Helper: Parse PDF buffer to text
async function parsePdf(buffer: Buffer): Promise<string> {
  try {
    const PDFParse = pdf.PDFParse;
    if (!PDFParse) {
      throw new Error("PDFParse constructor not found in library imports.");
    }
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    return result.text || "";
  } catch (error) {
    console.error("PDF parse error:", error);
    throw new Error("Failed to parse PDF file. Ensure it is not password-protected or corrupted.");
  }
}

// Helper: Parse DOCX buffer to text
async function parseDocx(buffer: Buffer): Promise<string> {
  try {
    const mammothParser = (mammoth as any).default || mammoth;
    const result = await mammothParser.extractRawText({ buffer });
    return result.value || "";
  } catch (error) {
    console.error("DOCX parse error:", error);
    throw new Error("Failed to parse Word Document. Ensure it is not corrupted.");
  }
}

// Endpoint: Extract text from resume
app.post("/api/extract-text", async (req, res): Promise<any> => {
  try {
    const { fileData, fileName } = req.body;

    if (!fileData || !fileName) {
      return res.status(400).json({ error: "No file data or file name provided." });
    }

    // Decode base64
    const base64Data = fileData.replace(/^data:.*;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const extension = path.extname(fileName).toLowerCase();

    let text = "";

    if (extension === ".pdf") {
      text = await parsePdf(buffer);
    } else if (extension === ".docx" || extension === ".doc") {
      text = await parseDocx(buffer);
    } else if (extension === ".txt" || extension === ".md") {
      text = buffer.toString("utf-8");
    } else {
      return res.status(400).json({ error: "Unsupported file type. Please upload a PDF, DOCX, or TXT file." });
    }

    // Clean up text
    const cleanedText = text.trim();

    // Check if empty or unreadable
    if (!cleanedText || cleanedText.length < 30) {
      return res.status(400).json({ error: "We couldn't read your resume. Try another file." });
    }

    // Calculate word count
    const wordCount = cleanedText.split(/\s+/).length;

    return res.json({
      text: cleanedText,
      wordCount,
      fileName,
    });
  } catch (error: any) {
    console.error("API Error /api/extract-text:", error);
    return res.status(500).json({ error: error.message || "Failed to process file." });
  }
});

// Endpoint: Roast resume
app.post("/api/roast", async (req, res): Promise<any> => {
  try {
    const { resumeText } = req.body;

    if (!resumeText || resumeText.trim().length < 30) {
      return res.status(400).json({ error: "We couldn't read your resume. Try another file." });
    }

    // Call Gemini API using structured JSON schema
    const prompt = `Roast this resume and provide a structured analysis.
    
Resume Text:
---
${resumeText}
---`;

    const systemInstruction = `You are a hilarious, brutally honest, but highly expert resume reviewer. 
Your job is to roast resumes by pointing out formatting errors, corporate speak clichés, unnecessary buzzwords, vague descriptions, missing achievements, and overall boring profiles.
However, you must also be constructive! Your review must contain:
1. An overall score (0-100) reflecting how competitive the resume actually is (be critical but fair, e.g., a standard resume with generic statements should get a 40-60, while a terrible one gets 10-30).
2. A sarcastic, witty, but professional "Roast Summary". Write like a seasoned, slightly cynical recruiter who has seen 10,000 resumes today. Be funny, sharp, but do NOT use offensive or highly vulgar language.
3. Top 5 critical weaknesses that make recruiters throw this resume in the bin.
4. Top 5 genuine strengths (e.g., solid quantitative impact, clean layout elements, strong technical stack) if any exist, or positive aspects to build on.
5. Top 5 highly actionable, concrete suggestions to turn this resume into a job-magnet.

Your output must be structured JSON matching the requested schema. Ensure all arrays have exactly 5 high-quality items.`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        overallScore: {
          type: Type.INTEGER,
          description: "A score from 0 to 100 indicating the strength of the resume.",
        },
        roastSummary: {
          type: Type.STRING,
          description: "A hilarious, sarcastic, but professional roast of the resume's formatting, clichés, gaps, and buzzwords.",
        },
        weaknesses: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Top 5 critical weaknesses of the resume, explained clearly.",
        },
        strengths: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Top 5 genuine strengths of the resume.",
        },
        suggestions: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Top 5 highly actionable, constructive suggestions to improve the resume.",
        },
      },
      required: ["overallScore", "roastSummary", "weaknesses", "strengths", "suggestions"],
    };

    // Robust generator with fallback and backoff retry mechanism
    const generateWithFallback = async (): Promise<string> => {
      const modelsToTry = [
        { name: "gemini-3.1-flash-lite", maxAttempts: 2 },
        { name: "gemini-3.5-flash", maxAttempts: 1 },
        { name: "gemini-flash-latest", maxAttempts: 1 }
      ];
      let lastErr: any = null;

      for (const modelConfig of modelsToTry) {
        const modelName = modelConfig.name;
        const attempts = modelConfig.maxAttempts;
        let delay = 800;

        for (let attempt = 1; attempt <= attempts; attempt++) {
          try {
            console.log(`[AI] Attempting roast with ${modelName} (attempt ${attempt}/${attempts})...`);
            const response = await getAIClient().models.generateContent({
              model: modelName,
              contents: prompt,
              config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: schema,
              },
            });

            if (response && response.text) {
              console.log(`[AI] Successful generation using model ${modelName}`);
              return response.text;
            }
          } catch (error: any) {
            lastErr = error;
            console.warn(`[AI] Warning: Model ${modelName} failed on attempt ${attempt}:`, error.message || error);

            const isTemporary = 
              error.status === 503 || error.statusCode === 503 ||
              error.status === 429 || error.statusCode === 429 ||
              String(error).includes("503") || String(error).includes("429") ||
              String(error).includes("high demand") || String(error).includes("UNAVAILABLE");

            if (isTemporary && attempt < attempts) {
              console.log(`[AI] Temporary error encountered. Retrying in ${delay}ms...`);
              await new Promise((resolve) => setTimeout(resolve, delay));
              delay *= 1.5;
            } else {
              break;
            }
          }
        }
      }
      throw lastErr || new Error("All attempts and fallback models exhausted.");
    };

    const resultText = await generateWithFallback();
    const parsedData = JSON.parse(resultText);

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error("API Error /api/roast:", error);
    return res.status(500).json({ error: error.message || "Failed to analyze resume." });
  }
});

// Vite middleware and static asset serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
