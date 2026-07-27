"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface HeroChemicalReactionProps {
  teacherName?: string;
  tagline?: string;
  onAnimationComplete?: () => void;
}

export function HeroChemicalReaction({
  teacherName = "مستر مصطفى عبد الباري",
  tagline = "أكاديمية تدريس الكيمياء",
  onAnimationComplete,
}: HeroChemicalReactionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    // Check session storage so it only plays ONCE per session visit
    const played = sessionStorage.getItem("chem_hero_intro_played");
    if (played) {
      setHasPlayed(true);
      if (onAnimationComplete) onAnimationComplete();
    }
  }, [onAnimationComplete]);

  const handleComplete = () => {
    sessionStorage.setItem("chem_hero_intro_played", "true");
    setHasPlayed(true);
    if (onAnimationComplete) onAnimationComplete();
  };

  // If reduced motion is requested or already played in session, render end-state directly
  if (prefersReducedMotion || hasPlayed) {
    return (
      <div className="relative w-full max-w-xl mx-auto py-8 flex flex-col items-center justify-center text-center">
        {/* Subtle glowing halo behind final branding */}
        <div 
          className="absolute w-64 h-64 rounded-full pointer-events-none opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, #00D4FF 0%, #00FF88 60%, transparent 100%)" }}
        />
        
        {/* Final Branding Badge */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 mb-4 rounded-2xl flex items-center justify-center text-3xl shadow-lg border border-[#00D4FF]/30 backdrop-blur-md bg-gradient-to-br from-[#00D4FF]/20 to-[#00FF88]/20 text-[#7AE8FF]">
            ⚛
          </div>
          <h2 className="font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight font-sans">
            {teacherName}
          </h2>
          <p className="text-[#00D4FF]/80 text-sm sm:text-base mt-2 font-medium tracking-wide">
            {tagline}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-xl mx-auto h-[320px] sm:h-[380px] flex items-center justify-center overflow-hidden">
      {/* Dynamic Glow Filter & Gradient Definitions */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          {/* Reaction Glow Filter */}
          <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Liquid Gradients */}
          <linearGradient id="cyanLiquid" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#0088FF" />
          </linearGradient>

          <linearGradient id="greenLiquid" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00FF88" />
            <stop offset="100%" stopColor="#00B359" />
          </linearGradient>

          <linearGradient id="mixedReaction" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D4FF" />
            <stop offset="50%" stopColor="#00FFB7" />
            <stop offset="100%" stopColor="#00FF88" />
          </linearGradient>
        </defs>
      </svg>

      {/* Main SVG Scene */}
      <svg
        viewBox="0 0 500 320"
        className="w-full h-full max-w-[500px] select-none"
        fill="none"
      >
        {/* ================= 1. LEFT FLASK (Cyan) ================= */}
        <motion.g
          initial={{ rotate: 0, x: 0, y: 0 }}
          animate={{
            rotate: [0, -35, -35, 0],
            x: [0, 60, 60, 0],
            y: [0, 15, 15, 0],
          }}
          transition={{
            duration: 4.5,
            times: [0, 0.25, 0.65, 0.9],
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "110px 140px" }}
        >
          {/* Flask Glass Outline */}
          <path
            d="M 100 80 L 100 110 L 70 170 C 65 180 72 190 85 190 L 135 190 C 148 190 155 180 150 170 L 120 110 L 120 80 Z"
            stroke="rgba(0, 212, 255, 0.35)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(10, 20, 40, 0.4)"
          />
          {/* Liquid Inside */}
          <path
            d="M 78 155 C 95 150 125 160 142 155 L 148 168 C 152 176 146 186 135 186 L 85 186 C 74 186 68 176 72 168 Z"
            fill="url(#cyanLiquid)"
            opacity={0.85}
          />
        </motion.g>

        {/* Liquid Stream (Left Cyan Flask) */}
        <motion.path
          d="M 135 115 Q 180 160 232 195"
          stroke="url(#cyanLiquid)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 1, 0],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 4.5,
            times: [0.2, 0.3, 0.6, 0.7],
            ease: "easeInOut",
          }}
        />

        {/* ================= 2. RIGHT FLASK (Green) ================= */}
        <motion.g
          initial={{ rotate: 0, x: 0, y: 0 }}
          animate={{
            rotate: [0, 35, 35, 0],
            x: [0, -60, -60, 0],
            y: [0, 15, 15, 0],
          }}
          transition={{
            duration: 4.5,
            times: [0, 0.25, 0.65, 0.9],
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "390px 140px" }}
        >
          {/* Flask Glass Outline */}
          <path
            d="M 380 80 L 380 110 L 350 170 C 345 180 352 190 365 190 L 415 190 C 428 190 435 180 430 170 L 400 110 L 400 80 Z"
            stroke="rgba(0, 255, 136, 0.35)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(10, 20, 40, 0.4)"
          />
          {/* Liquid Inside */}
          <path
            d="M 358 155 C 375 160 405 150 422 155 L 428 168 C 432 176 426 186 415 186 L 365 186 C 354 186 348 176 352 168 Z"
            fill="url(#greenLiquid)"
            opacity={0.85}
          />
        </motion.g>

        {/* Liquid Stream (Right Green Flask) */}
        <motion.path
          d="M 365 115 Q 320 160 268 195"
          stroke="url(#greenLiquid)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 1, 0],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 4.5,
            times: [0.2, 0.3, 0.6, 0.7],
            ease: "easeInOut",
          }}
        />

        {/* ================= 3. CENTER REACTION FLASK ================= */}
        <g transform="translate(0, 20)">
          {/* Flask Outer Glass Outline */}
          <path
            d="M 235 120 L 235 150 L 180 235 C 172 248 181 265 198 265 L 302 265 C 319 265 328 248 320 235 L 265 150 L 265 120 Z"
            stroke="rgba(0, 212, 255, 0.5)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(8, 14, 28, 0.65)"
          />

          {/* Mixing Solution Filling Up */}
          <motion.path
            d="M 190 248 C 220 240 280 252 310 248 L 300 261 C 298 263 293 263 290 263 L 210 263 C 207 263 202 263 200 261 Z"
            fill="url(#mixedReaction)"
            initial={{ scaleY: 0.1, opacity: 0 }}
            animate={{
              scaleY: [0, 1, 1.35],
              opacity: [0, 0.85, 1],
            }}
            transition={{
              duration: 4.5,
              times: [0.25, 0.6, 0.85],
              ease: "easeOut",
            }}
            style={{ transformOrigin: "250px 263px" }}
          />

          {/* ================= 4. REACTION PARTICLES & BUBBLES ================= */}
          {/* Rising Reaction Bubbles */}
          {[
            { cx: 235, delay: 1.8, r: 3 },
            { cx: 250, delay: 2.1, r: 4 },
            { cx: 265, delay: 2.4, r: 2.5 },
            { cx: 242, delay: 2.8, r: 3.5 },
            { cx: 258, delay: 3.1, r: 2 },
          ].map((bubble, i) => (
            <motion.circle
              key={i}
              cx={bubble.cx}
              cy={240}
              r={bubble.r}
              fill="#00FFB7"
              filter="url(#cyanGlow)"
              initial={{ opacity: 0, y: 0 }}
              animate={{
                opacity: [0, 0.9, 0],
                y: [0, -70],
                scale: [0.8, 1.4],
              }}
              transition={{
                duration: 1.6,
                delay: bubble.delay,
                repeat: 0,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Subtle Molecular Ring Orbiting Peak Reaction */}
          <motion.g
            initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.2, 1.4],
              rotate: 180,
            }}
            transition={{
              duration: 2.2,
              delay: 3.2,
              ease: "easeOut",
            }}
            style={{ transformOrigin: "250px 210px" }}
          >
            <ellipse
              cx="250"
              cy="210"
              rx="45"
              ry="16"
              stroke="#00D4FF"
              strokeWidth="1.2"
              strokeDasharray="4 4"
              fill="none"
              opacity="0.6"
            />
            <circle cx="295" cy="210" r="3" fill="#00FF88" />
            <circle cx="205" cy="210" r="3" fill="#00D4FF" />
          </motion.g>

          {/* Central Energy Glow Expansion */}
          <motion.circle
            cx="250"
            cy="215"
            r="35"
            fill="url(#mixedReaction)"
            filter="url(#cyanGlow)"
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{
              opacity: [0, 0, 0.6, 0.15],
              scale: [0.2, 0.2, 1.6, 2.2],
            }}
            transition={{
              duration: 4.8,
              times: [0, 0.6, 0.85, 1],
              ease: "easeInOut",
            }}
          />
        </g>
      </svg>

      {/* ================= 5. BRAND REVEAL AT PEAK REACTION ================= */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20 pointer-events-none"
        initial={{ opacity: 0, scale: 0.88, y: 15 }}
        animate={{
          opacity: [0, 0, 1],
          scale: [0.88, 0.88, 1],
          y: [15, 15, 0],
        }}
        transition={{
          duration: 5.2,
          times: [0, 0.72, 1],
          ease: "easeOut",
        }}
        onAnimationComplete={handleComplete}
      >
        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ delay: 3.8, duration: 0.6 }}
            className="w-14 h-14 sm:w-16 sm:h-16 mb-3 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-xl border border-[#00D4FF]/40 backdrop-blur-md bg-gradient-to-br from-[#00D4FF]/25 to-[#00FF88]/25 text-[#7AE8FF]"
          >
            ⚛
          </motion.div>
          
          <h2 className="font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight drop-shadow-[0_0_25px_rgba(0,212,255,0.4)]">
            {teacherName}
          </h2>
          
          <p className="text-[#00D4FF] text-xs sm:text-sm mt-1.5 font-bold tracking-widest uppercase drop-shadow">
            {tagline}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
