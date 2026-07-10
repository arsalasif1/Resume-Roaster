import { useState } from "react";
import { Flame, AlertCircle } from "lucide-react";
import FileUploader from "./components/FileUploader";
import ResumeTextPreview from "./components/ResumeTextPreview";
import LoadingState from "./components/LoadingState";
import RoastResults from "./components/RoastResults";
import { ExtractResponse, ResumeRoastResult } from "./types";

export default function App() {
  const [extractedFile, setExtractedFile] = useState<ExtractResponse | null>(null);
  const [isRoastLoading, setIsRoastLoading] = useState(false);
  const [roastResult, setRoastResult] = useState<ResumeRoastResult | null>(null);
  const [roastError, setRoastError] = useState<string | null>(null);

  const handleFileExtracted = (fileData: ExtractResponse) => {
    setExtractedFile(fileData);
    setRoastError(null);
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
      
      {/* Main Container */}
      <main className="w-full max-w-2xl mx-auto px-4 py-12 sm:py-20 flex-grow flex flex-col justify-center">
        
        {/* Header Section - Hide if displaying active roast results to save screen space */}
        {!roastResult && !isRoastLoading && (
          <div className="text-center mb-10 space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full text-xs font-mono font-semibold uppercase tracking-wider">
              <Flame className="w-4 h-4 fill-current text-orange-500 animate-pulse" />
              <span>Sarcastic Recruitment AI</span>
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
      <footer className="w-full text-center py-6 border-t border-gray-900/50 bg-gray-950">
        <p className="font-sans text-xs text-gray-500">
          Humor-focused AI feedback. Fix your resume and secure the bag.
        </p>
      </footer>
    </div>
  );
}
