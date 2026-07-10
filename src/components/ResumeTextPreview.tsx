import { useState } from "react";
import { Eye, EyeOff, FileText } from "lucide-react";

interface ResumeTextPreviewProps {
  text: string;
  wordCount: number;
}

export default function ResumeTextPreview({ text, wordCount }: ResumeTextPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const CHAR_LIMIT = 600;
  const isTruncated = text.length > CHAR_LIMIT;
  const displayText = isOpen || !isTruncated ? text : text.substring(0, CHAR_LIMIT) + "...";

  return (
    <div 
      id="resume-preview-container"
      className="mt-6 border border-gray-800 rounded-xl bg-gray-950/60 overflow-hidden transition-all duration-300"
    >
      <button
        type="button"
        id="toggle-preview-button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-900/40 text-left transition-colors cursor-pointer"
      >
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-orange-500" />
          <span className="font-sans font-medium text-sm text-gray-300">
            Extracted Text Preview ({wordCount} words)
          </span>
        </div>
        <div className="flex items-center space-x-1.5 text-xs text-orange-500 font-medium">
          {isOpen ? (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              <span>Hide Full Text</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Show Extracted Text</span>
            </>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 border-t border-gray-800 bg-gray-900/20">
          {isTruncated && (
            <div className="mb-3 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs rounded-lg font-sans">
              💡 <strong>Note:</strong> Very long resumes are truncated in this visual preview to save space, but the <strong>full content</strong> will be sent to the AI for roasting.
            </div>
          )}
          <pre className="font-mono text-xs text-gray-300 leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto pr-2 custom-scrollbar select-text">
            {displayText}
          </pre>
        </div>
      )}
    </div>
  );
}
