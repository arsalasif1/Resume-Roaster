import { useState, useEffect } from "react";
import { Flame, AlertCircle, Mail, Linkedin, Github } from "lucide-react";
import FileUploader from "./components/FileUploader";
import ResumeTextPreview from "./components/ResumeTextPreview";
import LoadingState from "./components/LoadingState";
import RoastResults from "./components/RoastResults";
import { ExtractResponse, ResumeRoastResult } from "./types";
import AnimatedCatGrill from "./components/AnimatedCatGrill";

export default function App() {
  const [extractedFile, setExtractedFile] = useState<ExtractResponse | null>(null);
  const [isRoastLoading, setIsRoastLoading] = useState(false);
  const [roastResult, setRoastResult] = useState<ResumeRoastResult | null>(null);
  const [roastError, setRoastError] = useState<string | null>(null);
  const [resumeCount, setResumeCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch("/api/resume-count");
        if (response.ok) {
          const data = await response.json();
          setResumeCount(data.count);
        }
      } catch (err) {
        console.error("Failed to fetch resume count", err);
      }
    };
    fetchCount();
  }, []);

  const handleFileExtracted = (fileData: ExtractResponse) => {
    setExtractedFile(fileData);
    setRoastError(null);
    if (fileData.totalUniqueCount !== undefined) {
      setResumeCount(fileData.totalUniqueCount);
    }
  };

  const handleReset = () => {
    setExtractedFile(null);
    setRoastResult(null);
    setRoastError(null);
    setIsRoastLoading(false);
  };

  const handleRoast = async () => {
    if (!extractedFile) {
      setRoastError("Please upload a resume first.");
      return;
    }

    setIsRoastLoading(true);
    setRoastError(null);

    try {
      const response = await fetch("/api/roast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText: extractedFile.text,
        }),
      });

      let data: any;
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        const snippet = text.substring(0, 150);
        console.error("Non-JSON Response received:", snippet);
        
        if (response.status === 504 || response.status === 502) {
          throw new Error("The AI server timed out under heavy load. Please try again in a few seconds.");
        } else {
          throw new Error(`Server returned an invalid format. Status: ${response.status}`);
        }
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze resume.");
      }

      setRoastResult(data.data);
    } catch (err: any) {
      console.error(err);
      setRoastError(err.message || "We encountered an issue while roasting your resume. Please try again.");
    } finally {
      setIsRoastLoading(false);
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen text-gray-100 flex flex-col justify-between selection:bg-orange-500/30 selection:text-orange-200">
      
      {/* Top Counter Bar */}
      <div className="w-full py-3.5 px-6 border-b border-gray-900/50 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-sans font-extrabold tracking-tight bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">🔥 Resume Roast</span>
        </div>
        
        {resumeCount !== null && (
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full text-xs font-mono font-medium shadow-sm shadow-orange-500/[0.05]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span>{resumeCount} Resumes Grilled</span>
          </div>
        )}
      </div>

      {/* Main Container */}
      <main className="w-full max-w-2xl mx-auto px-4 py-12 sm:py-20 flex-grow flex flex-col justify-center">
        
        {/* Header Section - Hide if displaying active roast results to save screen space */}
        {!roastResult && !isRoastLoading && (
          <div className="text-center mb-10 space-y-4">
            <div className="flex flex-col items-center mb-4">
              <div className="mb-4">
                <AnimatedCatGrill isRoasting={false} size="md" />
              </div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full text-xs font-mono font-semibold uppercase tracking-wider">
                <span>🔥 Sarcastic Grill Master AI</span>
              </div>
            </div>
            
            <h1 className="font-sans font-extrabold text-4xl sm:text-5xl tracking-tight bg-gradient-to-r from-orange-400 via-orange-500 to-red-600 bg-clip-text text-transparent">
              Resume Roast
            </h1>
            
            <p className="font-sans text-sm sm:text-base text-gray-400 max-w-md mx-auto leading-relaxed">
              Upload your PDF, DOCX, or TXT resume to receive a brutally honest review, highlighting top weaknesses and actionable feedback.
            </p>
          </div>
        )}

        {/* Dynamic App State Render */}
        <div className="space-y-6">
          {isRoastLoading ? (
            <LoadingState />
          ) : roastResult ? (
            <div className="space-y-4">
              <div className="text-center mb-2">
                <h1 className="font-sans font-extrabold text-2xl sm:text-3xl tracking-tight bg-gradient-to-r from-orange-400 via-orange-500 to-red-600 bg-clip-text text-transparent">
                  Your Roast is Ready 🔥
                </h1>
                <p className="text-xs text-gray-400 mt-1">Based on "{extractedFile?.fileName}"</p>
              </div>
              <RoastResults result={roastResult} onReset={handleReset} />
            </div>
          ) : (
            <div className="bg-gray-900/40 p-5 sm:p-8 rounded-2xl border border-gray-800/80 shadow-xl space-y-6">
              
              {/* Step 1: Upload File */}
              <FileUploader
                onFileExtracted={handleFileExtracted}
                onReset={handleReset}
                extractedFile={extractedFile}
              />

              {/* Step 2: Show preview and trigger roast */}
              {extractedFile && (
                <div className="space-y-6 animate-fade-in">
                  <ResumeTextPreview
                    text={extractedFile.text}
                    wordCount={extractedFile.wordCount}
                  />

                  {/* Roast CTA */}
                  <button
                    type="button"
                    id="roast-my-resume-cta"
                    onClick={handleRoast}
                    className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-sans font-bold text-base sm:text-lg rounded-xl shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 border border-orange-400/20 hover:border-orange-500/30 active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Flame className="w-5 h-5 fill-current animate-bounce" />
                    <span>Roast My Resume</span>
                  </button>
                </div>
              )}

              {/* General error feedback */}
              {roastError && (
                <div 
                  id="app-error-banner"
                  className="flex items-start space-x-3 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
                  <p className="font-sans">{roastError}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 border-t border-gray-900/50 bg-gray-950 flex flex-col items-center justify-center space-y-2">
        <p className="font-sans text-xs text-gray-500">
          Humor-focused AI feedback. Fix your resume and secure the bag.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs font-mono text-gray-400 mt-2">
          <a
            id="footer-contact-email"
            href="mailto:arsalasif1@gmail.com"
            className="flex items-center space-x-1.5 hover:text-orange-400 transition-colors duration-200"
          >
            <Mail className="w-3.5 h-3.5 text-gray-500" />
            <span>arsalasif1@gmail.com</span>
          </a>
          <span className="hidden sm:inline text-gray-800">|</span>
          <a
            id="footer-contact-linkedin"
            href="https://linkedin.com/in/mohammad-arsal-asif"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 hover:text-orange-400 transition-colors duration-200"
          >
            <Linkedin className="w-3.5 h-3.5 text-gray-500" />
            <span>mohammad-arsal-asif</span>
          </a>
          <span className="hidden sm:inline text-gray-800">|</span>
          <a
            id="footer-contact-github"
            href="https://github.com/arsalasif1"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 hover:text-orange-400 transition-colors duration-200"
          >
            <Github className="w-3.5 h-3.5 text-gray-500" />
            <span>github.com/arsalasif1</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
