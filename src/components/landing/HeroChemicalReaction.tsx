"use client";

import { m as motion } from "framer-motion";

export function HeroChemicalReaction() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      {/* Cyan Flask */}
      <motion.div
        className="absolute"
        style={{
          top: "18%",
          left: "12%",
        }}
        initial={{ opacity: 0, x: -60, rotate: -18 }}
        animate={{ opacity: 1, x: 0, rotate: -10 }}
        transition={{ duration: 1 }}
      >
        <svg width="120" height="170" viewBox="0 0 120 170">
          <path
            d="M50 10
               L70 10
               L70 55
               L95 105
               C105 125 100 155 60 160
               C20 155 15 125 25 105
               L50 55 Z"
            fill="rgba(255,255,255,.08)"
            stroke="#7AE8FF"
            strokeWidth="2"
          />

          <motion.path
            d="M32 112
               C30 140 45 150 60 152
               C75 150 90 140 88 112 Z"
            fill="#00D4FF"
            animate={{
              d: [
                "M32 112 C30 140 45 150 60 152 C75 150 90 140 88 112 Z",
                "M30 108 C30 138 46 148 60 151 C76 149 91 138 90 108 Z",
                "M32 112 C30 140 45 150 60 152 C75 150 90 140 88 112 Z",
              ],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
            }}
          />
        </svg>
      </motion.div>

      {/* Green Flask */}

      <motion.div
        className="absolute"
        style={{
          top: "18%",
          right: "12%",
        }}
        initial={{ opacity: 0, x: 60, rotate: 18 }}
        animate={{ opacity: 1, x: 0, rotate: 10 }}
        transition={{ duration: 1 }}
      >
        <svg width="120" height="170" viewBox="0 0 120 170">
          <path
            d="M50 10
               L70 10
               L70 55
               L95 105
               C105 125 100 155 60 160
               C20 155 15 125 25 105
               L50 55 Z"
            fill="rgba(255,255,255,.08)"
            stroke="#00FF88"
            strokeWidth="2"
          />

          <motion.path
            d="M32 112
               C30 140 45 150 60 152
               C75 150 90 140 88 112 Z"
            fill="#00FF88"
            animate={{
              d: [
                "M32 112 C30 140 45 150 60 152 C75 150 90 140 88 112 Z",
                "M30 108 C30 138 46 148 60 151 C76 149 91 138 90 108 Z",
                "M32 112 C30 140 45 150 60 152 C75 150 90 140 88 112 Z",
              ],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              delay: .5,
            }}
          />
        </svg>
      </motion.div>

      {/* Central Reaction Flask */}

      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: "23%",
        }}
        initial={{ opacity: 0, scale: .8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: .6 }}
      >
        <svg width="220" height="250" viewBox="0 0 220 250">

          <path
            d="
            M90 20
            L130 20
            L130 80
            L180 180
            C190 215 165 235 110 240
            C55 235 30 215 40 180
            L90 80 Z"
            fill="rgba(255,255,255,.05)"
            stroke="#7AE8FF"
            strokeWidth="2.5"
          />

          <motion.circle
            cx="110"
            cy="185"
            r="4"
            fill="#00D4FF"
            animate={{
              cy:[185,70,185],
              opacity:[0,1,0]
            }}
            transition={{
              repeat:Infinity,
              duration:3
            }}
          />

          <motion.circle
            cx="130"
            cy="200"
            r="3"
            fill="#00FF88"
            animate={{
              cy:[200,80,200],
              opacity:[0,1,0]
            }}
            transition={{
              repeat:Infinity,
              duration:2.4,
              delay:.6
            }}
          />

        </svg>

      </motion.div>
    </div>
  );
}
