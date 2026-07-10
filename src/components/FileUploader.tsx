import React, { useState, useRef } from "react";
import { UploadCloud, FileText, Trash2, AlertCircle, Loader2 } from "lucide-react";
import { ExtractResponse } from "../types";

interface FileUploaderProps {
  onFileExtracted: (data: ExtractResponse) => void;
  onReset: () => void;
  extractedFile: ExtractResponse | null;
}

export default function FileUploader({
  onFileExtracted,
  onReset,
  extractedFile,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    const validExtensions = ["pdf", "docx", "doc", "txt", "md"];

    if (!extension || !validExtensions.includes(extension)) {
      setError("Unsupported file type. Please upload a PDF, DOCX, or TXT file.");
      return;
    }

    // Read file as base64
    setIsExtracting(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64Data = e.target?.result as string;
        
        const response = await fetch("/api/extract-text", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileData: base64Data,
            fileName: file.name,
          }),
        });

        let data: any;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
        } else {
          const text = await response.text();
          throw new Error(`Server returned unexpected format: ${text.substring(0, 100)}`);
        }

        if (!response.ok) {
          throw new Error(data.error || "Failed to extract text from your resume.");
        }

        onFileExtracted(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "We couldn't read your resume. Try another file.");
      } finally {
        setIsExtracting(false);
      }
    };

    reader.onerror = () => {
      setError("Failed to read local file. Please try another file.");
      setIsExtracting(false);
    };

    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx,.doc,.txt,.md"
        className="hidden"
        id="resume-file-input"
      />

      {extractedFile ? (
        <div 
          id="uploaded-file-container"
          className="flex items-center justify-between p-4 bg-gray-900 border border-orange-500/30 rounded-xl shadow-lg shadow-orange-500/5 transition-all duration-300 hover:border-orange-500/50"
        >
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500 flex-shrink-0">
              <FileText className="w-6 h-6 animate-pulse" />
            </div>
            <div className="overflow-hidden">
              <p className="font-sans font-medium text-gray-100 truncate text-sm sm:text-base">
                {extractedFile.fileName}
              </p>
              <p className="font-mono text-xs text-gray-400">
                {extractedFile.wordCount} words extracted
              </p>
            </div>
          </div>
          <button
            type="button"
            id="remove-file-button"
            onClick={() => {
              onReset();
              setError(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
            className="p-2 hover:bg-red-500/10 text-gray-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
            title="Remove File"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div
          id="dropzone-area"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`flex flex-col items-center justify-center min-h-[220px] p-6 text-center border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
            isDragging
              ? "border-orange-500 bg-orange-500/5 shadow-inner shadow-orange-500/10"
              : "border-gray-700 bg-gray-900/60 hover:border-orange-500/50 hover:bg-orange-500/[0.02]"
          }`}
        >
          {isExtracting ? (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
              <div>
                <p className="font-sans font-medium text-gray-200">Analyzing formatting & text...</p>
                <p className="text-xs text-gray-400 mt-1">Reading elements from the file</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <div className="p-3 bg-gray-800 rounded-2xl border border-gray-700 group-hover:border-orange-500/40 transition-colors">
                <UploadCloud className="w-8 h-8 text-orange-500" />
              </div>
              <div>
                <p className="font-sans font-medium text-gray-200 text-sm sm:text-base">
                  Drag and drop your resume here, or <span className="text-orange-500 hover:underline">browse</span>
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Supports PDF, DOCX, or TXT (Max 10MB)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div 
          id="upload-error-banner"
          className="mt-4 flex items-start space-x-3 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
          <p className="font-sans">{error}</p>
        </div>
      )}
    </div>
  );
}
