import { useState } from "react";
import { 
  Flame, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  CheckCircle2, 
  Lightbulb, 
  RefreshCw,
  Frown,
  Meh,
  Smile,
  Award
} from "lucide-react";
import { ResumeRoastResult } from "../types";

interface RoastResultsProps {
  result: ResumeRoastResult;
  onReset: () => void;
}

export default function RoastResults({ result, onReset }: RoastResultsProps) {
  const [openCard, setOpenCard] = useState<string | null>("roast");

  const score = result.overallScore;

  // Determine score color & rating name
  let scoreColor = "text-red-500 border-red-500/20 bg-red-500/5";
  let scoreGlow = "shadow-red-500/10";
  let ratingLabel = "BURNT TO A CRISP";
  let RatingIcon = Frown;

  if (score > 80) {
    scoreColor = "text-emerald-500 border-emerald-500/20 bg-emerald-500/5";
    scoreGlow = "shadow-emerald-500/10";
    ratingLabel = "GOLDEN CRUST";
    RatingIcon = Award;
  } else if (score > 60) {
    scoreColor = "text-yellow-500 border-yellow-500/20 bg-yellow-500/5";
    scoreGlow = "shadow-yellow-500/10";
    ratingLabel = "MEDIUM RARE";
    RatingIcon = Smile;
  } else if (score > 35) {
    scoreColor = "text-orange-500 border-orange-500/20 bg-orange-500/5";
    scoreGlow = "shadow-orange-500/10";
    ratingLabel = "SEAR & ROAST";
    RatingIcon = Meh;
  }

  const toggleCard = (cardName: string) => {
    setOpenCard(openCard === cardName ? null : cardName);
  };

  return (
    <div className="w-full space-y-6">
      {/* Head Score Dial Card */}
      <div 
        id="score-card"
        className="relative overflow-hidden p-6 rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl transition-all duration-300"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Circular Score Element */}
          <div className="relative flex-shrink-0 flex items-center justify-center">
            {/* Background Circle */}
            <div className="w-28 h-28 rounded-full border-4 border-gray-800 flex items-center justify-center flex-col">
              <div className="flex items-center">
                <span className="text-4xl font-mono font-bold text-gray-100">{score}</span>
                <span className="text-sm font-sans font-semibold text-gray-400">/100</span>
              </div>
              <div className="flex items-center text-orange-500 text-xs font-semibold mt-1">
                <Flame className="w-3.5 h-3.5 fill-current mr-0.5 animate-pulse" />
                <span>Roast 🔥</span>
              </div>
            </div>
            {/* Accent colored glowing indicator ring */}
            <div className="absolute inset-0 rounded-full border-4 border-orange-500 animate-pulse border-t-transparent border-r-transparent opacity-40" />
          </div>

          {/* Sarcastic recruiter summary */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className={`px-2.5 py-1 text-[11px] font-mono font-bold tracking-wider rounded-md border ${scoreColor} ${scoreGlow}`}>
                {ratingLabel}
              </span>
              <span className="text-xs text-gray-400 font-mono flex items-center">
                <RatingIcon className="w-3.5 h-3.5 mr-1" /> Verified AI Recruiters
              </span>
            </div>
            <h2 className="font-sans font-extrabold text-xl sm:text-2xl text-gray-100 leading-tight">
              Our Brutal Assessment
            </h2>
            <p className="font-sans text-sm sm:text-base text-gray-300 italic leading-relaxed">
              "{result.roastSummary}"
            </p>
          </div>
        </div>
      </div>

      {/* Accordion list */}
      <div className="space-y-4">
        {/* WEAKNESSES CARD */}
        <div 
          id="weaknesses-card"
          className="border border-red-500/20 bg-gray-900 rounded-xl overflow-hidden transition-all duration-300 shadow-md shadow-red-500/[0.01]"
        >
          <button
            type="button"
            id="toggle-weaknesses-button"
            onClick={() => toggleCard("weaknesses")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800/20 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="p-1.5 bg-red-500/10 text-red-500 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-gray-100 text-sm sm:text-base">Top 5 Weaknesses</h3>
                <p className="text-xs text-gray-400">Where recruiters' heads hurt</p>
              </div>
            </div>
            {openCard === "weaknesses" ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
          
          {openCard === "weaknesses" && (
            <div className="p-4 border-t border-gray-800 bg-gray-950/40 space-y-3">
              {result.weaknesses.map((weakness, i) => (
                <div key={i} className="flex items-start space-x-3 p-3 bg-red-500/[0.02] border border-red-500/10 rounded-lg">
                  <span className="font-mono text-xs font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full mt-0.5">
                    #{i + 1}
                  </span>
                  <p className="font-sans text-sm text-gray-300 leading-relaxed">{weakness}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* STRENGTHS CARD */}
        <div 
          id="strengths-card"
          className="border border-emerald-500/20 bg-gray-900 rounded-xl overflow-hidden transition-all duration-300 shadow-md shadow-emerald-500/[0.01]"
        >
          <button
            type="button"
            id="toggle-strengths-button"
            onClick={() => toggleCard("strengths")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800/20 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-gray-100 text-sm sm:text-base">Top 5 Strengths</h3>
                <p className="text-xs text-gray-400">Actually not half-bad details</p>
              </div>
            </div>
            {openCard === "strengths" ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
          
          {openCard === "strengths" && (
            <div className="p-4 border-t border-gray-800 bg-gray-950/40 space-y-3">
              {result.strengths.map((strength, i) => (
                <div key={i} className="flex items-start space-x-3 p-3 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-lg">
                  <span className="font-mono text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full mt-0.5">
                    #{i + 1}
                  </span>
                  <p className="font-sans text-sm text-gray-300 leading-relaxed">{strength}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SUGGESTIONS CARD */}
        <div 
          id="suggestions-card"
          className="border border-orange-500/20 bg-gray-900 rounded-xl overflow-hidden transition-all duration-300 shadow-md shadow-orange-500/[0.01]"
        >
          <button
            type="button"
            id="toggle-suggestions-button"
            onClick={() => toggleCard("suggestions")}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800/20 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="p-1.5 bg-orange-500/10 text-orange-500 rounded-lg">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-gray-100 text-sm sm:text-base">Actionable Suggestions</h3>
                <p className="text-xs text-gray-400">Concrete steps to fix this mess</p>
              </div>
            </div>
            {openCard === "suggestions" ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
          
          {openCard === "suggestions" && (
            <div className="p-4 border-t border-gray-800 bg-gray-950/40 space-y-3">
              {result.suggestions.map((suggestion, i) => (
                <div key={i} className="flex items-start space-x-3 p-3 bg-orange-500/[0.02] border border-orange-500/10 rounded-lg">
                  <span className="font-mono text-xs font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full mt-0.5">
                    #{i + 1}
                  </span>
                  <p className="font-sans text-sm text-gray-300 leading-relaxed">{suggestion}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Another Button */}
      <div className="flex justify-center pt-2">
        <button
          type="button"
          id="roast-again-button"
          onClick={onReset}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-800 hover:bg-gray-750 text-gray-200 hover:text-white rounded-xl border border-gray-700 transition-all font-sans font-semibold text-sm cursor-pointer active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Upload Another Resume</span>
        </button>
      </div>
    </div>
  );
}
