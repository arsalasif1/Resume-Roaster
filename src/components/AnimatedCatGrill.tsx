import { motion } from "motion/react";
import catImage from "../assets/images/cat_barbqing_cv_1783708934117.jpg";

interface AnimatedCatGrillProps {
  isRoasting?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function AnimatedCatGrill({ isRoasting = false, size = "md" }: AnimatedCatGrillProps) {
  // Dimensions based on size prop
  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-28 h-28",
    lg: "w-36 h-36"
  };

  // Generate a few random sparks
  const sparks = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    delay: i * (isRoasting ? 0.3 : 0.6),
    duration: isRoasting ? 1.2 + Math.random() * 0.8 : 2.0 + Math.random() * 1.5,
    size: Math.random() * 4 + 2,
    xStart: Math.random() * 80 - 40, // spread across bottom
    xEnd: Math.random() * 120 - 60,   // drift left/right
  }));

  // Generate a few smoke puffs
  const smokePuffs = Array.from({ length: 4 }, (_, i) => ({
    id: i,
    delay: i * (isRoasting ? 0.6 : 1.2),
    duration: isRoasting ? 2.5 + Math.random() * 1.0 : 4.0 + Math.random() * 2.0,
    size: Math.random() * 16 + 12,
    xStart: Math.random() * 40 - 20,
    xEnd: Math.random() * 60 - 30,
  }));

  return (
    <div className="relative flex flex-col items-center">
      {/* Dynamic Hot Ember Base Glow */}
      <motion.div
        animate={{
          scale: isRoasting ? [1, 1.15, 1] : [1, 1.05, 1],
          opacity: isRoasting ? [0.4, 0.75, 0.4] : [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: isRoasting ? 1.5 : 3.0,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-2 w-24 h-6 bg-orange-600/30 rounded-full blur-md animate-pulse"
      />

      {/* Main Backing Radial Heat Glow */}
      <motion.div
        animate={{
          scale: isRoasting ? [0.95, 1.1, 0.95] : [0.98, 1.02, 0.98],
          opacity: isRoasting ? [0.6, 0.9, 0.6] : [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: isRoasting ? 2.0 : 4.0,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-32 h-32 bg-orange-500/10 rounded-full blur-2xl"
      />

      {/* Sparks & Embers Floating Up (Rendered behind the avatar for depth) */}
      <div className="absolute inset-x-0 -top-8 bottom-0 overflow-visible pointer-events-none z-0">
        {sparks.map((spark) => (
          <motion.div
            key={`spark-back-${spark.id}`}
            initial={{ 
              x: spark.xStart, 
              y: 80, 
              opacity: 0, 
              scale: 0.5 
            }}
            animate={{
              y: [-10, -80],
              x: [spark.xStart, spark.xEnd],
              opacity: [0, 0.9, 0.7, 0],
              scale: [0.5, 1.2, 0.4],
            }}
            transition={{
              duration: spark.duration,
              repeat: Infinity,
              delay: spark.delay,
              ease: "easeOut",
            }}
            className="absolute left-1/2 rounded-full bg-gradient-to-t from-yellow-400 to-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"
            style={{
              width: spark.size,
              height: spark.size,
            }}
          />
        ))}
      </div>

      {/* Main Avatar / Grill Base */}
      <div className="relative">
        <motion.div
          animate={isRoasting ? {
            y: [0, -3, 1, -2, 0],
            x: [0, 1, -1, 0.5, 0],
            rotate: [0, 1, -1, 0.5, 0],
          } : {
            y: [0, -2, 0],
            rotate: [0, 0.5, -0.2, 0],
          }}
          transition={isRoasting ? {
            duration: 0.5,
            repeat: Infinity,
            ease: "linear",
          } : {
            duration: 4.0,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`relative ${sizeClasses[size]} rounded-full overflow-hidden border-2 border-orange-500/40 p-1 bg-gray-950/90 shadow-xl shadow-orange-500/10 z-10`}
        >
          {/* Actual Image */}
          <img
            src={catImage}
            alt="Cat Grill Master Mascot"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover rounded-full select-none"
          />

          {/* Heat overlay on the image when roasting */}
          {isRoasting && (
            <motion.div
              animate={{ opacity: [0.05, 0.25, 0.05] }}
              transition={{ duration: 1.0, repeat: Infinity }}
              className="absolute inset-1 bg-red-500 rounded-full mix-blend-color-dodge pointer-events-none"
            />
          )}

          {/* Inner shadow/border ring */}
          <div className="absolute inset-0 border border-orange-500/20 rounded-full pointer-events-none" />
        </motion.div>

        {/* --- Synchronized Spatula & Flipping CV Steak Layer --- */}
        {isRoasting && (
          <>
            {/* 1. Metal Spatula doing the flipping motion */}
            <motion.div
              animate={{
                // Dip, flip/throw, recover, rest
                y: [28, 38, -5, 28, 28],
                x: [-28, -25, -2, -28, -28],
                rotate: [-20, -35, 25, -20, -20],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.15, 0.35, 0.65, 1.0],
              }}
              className="absolute z-25 pointer-events-none left-1/2 -ml-16 bottom-2 w-14 h-6 flex items-center origin-left"
            >
              {/* Wooden Handle */}
              <div className="w-5 h-1.5 bg-amber-800 rounded-l-sm shadow-md" />
              {/* Metal Shaft */}
              <div className="w-4 h-0.5 bg-neutral-400" />
              {/* Spatula Head */}
              <div className="relative w-7 h-4 bg-gradient-to-r from-neutral-300 to-neutral-400 border border-neutral-200 rounded-sm flex items-center justify-center space-x-0.5 shadow-sm">
                <div className="w-0.5 h-2 bg-neutral-600 rounded-full opacity-60" />
                <div className="w-0.5 h-2 bg-neutral-600 rounded-full opacity-60" />
                <div className="w-0.5 h-2 bg-neutral-600 rounded-full opacity-60" />
              </div>
            </motion.div>

            {/* 2. The Flipping "Resume Steak" */}
            <motion.div
              animate={{
                // Sizzles on grill, gets scooped/dipped, flies up doing a full 360 flip, lands with a sizzle
                y: [24, 30, -58, -65, 24, 24],
                x: [-12, -8, 2, 8, -12, -12],
                scale: [0.75, 0.72, 1.25, 1.15, 0.75, 0.75],
                rotate: [0, -10, 180, 360, 360, 360],
                rotateX: [0, -20, 180, 360, 360, 360],
                rotateY: [0, 0, 90, 180, 180, 180],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.15, 0.42, 0.52, 0.72, 1.0],
              }}
              className="absolute z-30 left-1/2 -ml-6 bottom-3 w-12 h-14 bg-orange-100 border border-orange-400/80 rounded-sm shadow-2xl p-1 overflow-hidden pointer-events-none"
              style={{
                transformStyle: "preserve-3d",
                perspective: 1200,
              }}
            >
              {/* Searing / Charring colors */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/35 via-transparent to-red-600/20 mix-blend-multiply pointer-events-none" />
              
              {/* Outer burnt border glow */}
              <div className="absolute inset-0 border border-orange-500/30 rounded-sm animate-pulse" />
              
              {/* Inside paper styling */}
              <div className="w-full h-full flex flex-col justify-between relative bg-amber-50/95 p-1 rounded-sm border border-amber-200">
                {/* Diagonal Grill Burn lines (seared marks) */}
                <div className="absolute inset-0 flex flex-col justify-around opacity-60 pointer-events-none">
                  <div className="h-[2px] w-[140%] -ml-2 bg-amber-950/70 rotate-[25deg]" />
                  <div className="h-[2px] w-[140%] -ml-2 bg-amber-950/70 rotate-[25deg]" />
                  <div className="h-[2px] w-[140%] -ml-2 bg-amber-950/70 rotate-[25deg]" />
                </div>
                
                {/* Paper Content mockup */}
                <div className="space-y-0.5">
                  <div className="w-4 h-1 bg-amber-500/80 rounded-full" />
                  <div className="w-8 h-[1px] bg-neutral-400" />
                  <div className="w-6 h-[1px] bg-neutral-400" />
                  <div className="w-7 h-[1px] bg-neutral-400" />
                </div>
                
                {/* Glow/Heat indicators */}
                <div className="flex justify-between items-center mt-1">
                  <div className="w-5 h-[1px] bg-neutral-400" />
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-ping opacity-75" />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Front-Facing Floating Sparks & Smoke for Overlay Depth */}
      <div className="absolute inset-x-0 -top-12 bottom-0 overflow-visible pointer-events-none z-20">
        {/* Smoke Puffs */}
        {smokePuffs.map((puff) => (
          <motion.div
            key={`smoke-${puff.id}`}
            initial={{
              x: puff.xStart,
              y: 60,
              opacity: 0,
              scale: 0.2,
            }}
            animate={{
              y: [-10, -100],
              x: [puff.xStart, puff.xEnd],
              opacity: [0, 0.18, 0.08, 0],
              scale: [0.2, 1.5, 2.5],
            }}
            transition={{
              duration: puff.duration,
              repeat: Infinity,
              delay: puff.delay,
              ease: "easeOut",
            }}
            className="absolute left-1/2 rounded-full bg-gray-400/20 blur-md"
            style={{
              width: puff.size,
              height: puff.size,
            }}
          />
        ))}

        {/* Coals Hot Sparks overlay on top */}
        {sparks.slice(0, 4).map((spark) => (
          <motion.div
            key={`spark-front-${spark.id}`}
            initial={{ 
              x: spark.xEnd * 0.5, 
              y: 70, 
              opacity: 0, 
              scale: 0.5 
            }}
            animate={{
              y: [10, -60],
              x: [spark.xEnd * 0.5, spark.xStart * 0.8],
              opacity: [0, 0.95, 0.5, 0],
              scale: [0.5, 1.4, 0.5],
            }}
            transition={{
              duration: spark.duration * 0.9,
              repeat: Infinity,
              delay: spark.delay + 0.2,
              ease: "easeOut",
            }}
            className="absolute left-1/2 rounded-full bg-gradient-to-t from-yellow-300 to-red-500 shadow-[0_0_6px_rgba(253,186,116,0.9)]"
            style={{
              width: spark.size * 0.8,
              height: spark.size * 0.8,
            }}
          />
        ))}
      </div>
    </div>
  );
}
