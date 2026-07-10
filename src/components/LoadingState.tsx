import { useState, useEffect } from "react";
import { Loader2, Flame } from "lucide-react";

const ROAST_PHRASES = [
  "Firing up the grill... 🥩",
  "Translating 'highly passionate' into actual skills... 🤔",
  "Calculating buzzword density (it's looking high)... 📈",
  "Deciphering what 'expert in Microsoft Word' really means... 🖨️",
  "Sifting through your 'innovative synergy'... 🌪️",
  "Warming up the sarcasm core... 🔥",
  "Evaluating if 'hard worker' means you like long coffee breaks... ☕",
  "Asking recruiters if they'd throw this in the digital or real recycling bin... 🗑️",
  "Polishing our blunt commentary... ✨",
  "Converting your timeline gaps into funny talking points... 🕰️",
];

export default function LoadingState() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [progress, setProgress] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % ROAST_PHRASES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Dynamic progressive bar: starts fast, slows down as it approaches 98%
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) return prev;
        const remaining = 98 - prev;
        // Take a random bite of the remaining space to simulate a smart processing curve
        const increment = Math.max(1, Math.min(12, Math.floor(remaining * 0.12 + Math.random() * 4)));
        return Math.min(98, prev + increment);
      });
    }, 350);

    return () => clearInterval(progressTimer);
  }, []);

  return (
    <div 
      id="analysis-loading-state"
      className="flex flex-col items-center justify-center py-12 px-6 text-center bg-gray-900/40 border border-orange-500/20 rounded-2xl shadow-xl shadow-orange-500/[0.02] max-w-lg mx-auto"
    >
      <div className="relative flex items-center justify-center mb-6">
        {/* Fire glow animation background */}
        <div className="absolute w-20 h-20 bg-orange-500/15 rounded-full blur-xl animate-pulse" />
        
        {/* Spinning loading outer, and a flame icon in the center */}
        <div className="relative">
          <Loader2 className="w-16 h-16 text-orange-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Flame className="w-6 h-6 text-red-500 animate-bounce" />
          </div>
        </div>
      </div>

      <h3 className="font-sans font-bold text-lg text-gray-100 tracking-tight">
        Searing Your Qualifications...
      </h3>
      
      <div className="h-10 mt-2 flex items-center justify-center">
        <p className="font-sans text-sm text-orange-400 font-medium transition-all duration-300">
          {ROAST_PHRASES[phraseIndex]}
        </p>
      </div>

      <div className="w-full max-w-xs mt-6 space-y-2">
        <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
          <span>ROASTING PROGRESS</span>
          <span className="text-orange-500 font-bold">{progress}%</span>
        </div>
        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden border border-gray-700/60 p-[1px]">
          <div 
            className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 h-full rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(249,115,22,0.3)]" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>

      <span className="text-[9px] font-mono text-gray-500 mt-2 uppercase tracking-widest">
        Roast-O-Meter warming up
      </span>
    </div>
  );
}
