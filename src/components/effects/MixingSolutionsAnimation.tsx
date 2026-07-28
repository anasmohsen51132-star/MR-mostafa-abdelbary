"use client";
// src/components/effects/MixingSolutionsAnimation.tsx
// Signature hero visual: two colored solutions tilt, pour, and mix inside a
// central beaker with a color-shift + rising bubbles, looping continuously.
// Fully responsive (clamp-based sizing) so it reads clearly on phone, tablet, and desktop.
import { m as motion } from "framer-motion";

interface Props {
  /** Max width in px on large screens. Scales down fluidly on smaller viewports. */
  maxWidth?: number;
  className?: string;
}

const LOOP = 4; // seconds per full cycle
const T = [0, 0.15, 0.35, 0.55, 0.75, 1];

export function MixingSolutionsAnimation({ maxWidth = 240, className = "" }: Props) {
  return (
    <div
      className={`relative mx-auto pointer-events-none select-none ${className}`}
      style={{
        width: `clamp(150px, 42vw, ${maxWidth}px)`,
        aspectRatio: "220 / 187",
      }}
    >
      <svg
        viewBox="0 0 220 187"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        {/* soft glow behind the whole scene */}
        <motion.ellipse
          cx="110" cy="120" rx="90" ry="60"
          fill="url(#mixGlow)"
          animate={{ opacity: [0.4, 0.4, 0.9, 0.9, 0.4, 0.4] }}
          transition={{ duration: LOOP, repeat: Infinity, ease: "easeInOut", times: T }}
        />

        <defs>
          <radialGradient id="mixGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7AE8FF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#7AE8FF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Left flask (cyan solution) — tilts inward to pour ── */}
        <motion.g
          style={{ transformOrigin: "38px 70px" }}
          animate={{ rotate: [0, 0, -40, -40, 0, 0] }}
          transition={{ duration: LOOP, repeat: Infinity, ease: "easeInOut", times: T }}
        >
          <path
            d="M28 18 L28 54 L9 93 Q6 101 17 101 L59 101 Q70 101 67 93 L48 54 L48 18 Z"
            fill="rgba(0,212,255,0.08)"
            stroke="#00D4FF"
            strokeWidth="2"
          />
          <rect x="23" y="11" width="30" height="8" rx="2" fill="rgba(0,212,255,0.16)" stroke="#00D4FF" strokeWidth="1.5" />
          <path d="M19 79 L47 79 L59 99 Q61 101 57 101 L19 101 Q13 101 15 99 Z" fill="#00D4FF" opacity="0.55" />
        </motion.g>

        {/* stream poured from the left flask */}
        <motion.path
          d="M52 97 Q72 108 90 119"
          stroke="#00D4FF"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          animate={{ opacity: [0, 0, 1, 1, 0, 0] }}
          transition={{ duration: LOOP, repeat: Infinity, ease: "easeInOut", times: T }}
        />

        {/* ── Right flask (green solution) — tilts inward to pour ── */}
        <motion.g
          style={{ transformOrigin: "182px 70px" }}
          animate={{ rotate: [0, 0, 40, 40, 0, 0] }}
          transition={{ duration: LOOP, repeat: Infinity, ease: "easeInOut", times: T }}
        >
          <path
            d="M192 18 L192 54 L211 93 Q214 101 203 101 L161 101 Q150 101 153 93 L172 54 L172 18 Z"
            fill="rgba(0,255,136,0.08)"
            stroke="#00FF88"
            strokeWidth="2"
          />
          <rect x="167" y="11" width="30" height="8" rx="2" fill="rgba(0,255,136,0.16)" stroke="#00FF88" strokeWidth="1.5" />
          <path d="M173 79 L201 79 L205 99 Q207 101 201 101 L163 101 Q159 101 161 99 Z" fill="#00FF88" opacity="0.55" />
        </motion.g>

        {/* stream poured from the right flask */}
        <motion.path
          d="M168 97 Q148 108 130 119"
          stroke="#00FF88"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          animate={{ opacity: [0, 0, 1, 1, 0, 0] }}
          transition={{ duration: LOOP, repeat: Infinity, ease: "easeInOut", times: T }}
        />

        {/* ── Central beaker receiving + mixing the two solutions ── */}
        <path
          d="M77 119 L143 119 L136 172 Q135 178 128 178 L92 178 Q85 178 84 172 Z"
          fill="rgba(255,255,255,0.03)"
          stroke="rgba(122,232,255,0.5)"
          strokeWidth="2"
        />
        <line x1="72" y1="119" x2="148" y2="119" stroke="rgba(122,232,255,0.5)" strokeWidth="2" strokeLinecap="round" />

        {/* rising, color-shifting liquid: cyan + green blend into violet */}
        <motion.path
          animate={{
            d: [
              "M89 168 L131 168 L129 174 Q128 177 124 177 L96 177 Q92 177 91 174 Z",
              "M89 168 L131 168 L129 174 Q128 177 124 177 L96 177 Q92 177 91 174 Z",
              "M84 150 L136 150 L130 174 Q129 177 125 177 L95 177 Q91 177 90 174 Z",
              "M80 133 L140 133 L131 174 Q130 177 126 177 L94 177 Q90 177 89 174 Z",
              "M80 133 L140 133 L131 174 Q130 177 126 177 L94 177 Q90 177 89 174 Z",
              "M89 168 L131 168 L129 174 Q128 177 124 177 L96 177 Q92 177 91 174 Z",
            ],
            fill: ["#00D4FF", "#00D4FF", "#5FC8E8", "#B47AFF", "#B47AFF", "#00D4FF"],
            opacity: [0, 0, 1, 1, 1, 0],
          }}
          transition={{ duration: LOOP, repeat: Infinity, ease: "easeInOut", times: T }}
        />

        {/* small bubbles rising while the reaction happens */}
        {[0, 1, 2, 3].map((i) => (
          <motion.circle
            key={i}
            cx={96 + i * 11}
            r={i % 2 === 0 ? 2.4 : 1.8}
            fill="#FFFFFF"
            animate={{
              cy: [173, 173, 173, 145 - i * 5, 145 - i * 5, 173],
              opacity: [0, 0, 0, 0.85, 0, 0],
            }}
            transition={{ duration: LOOP, repeat: Infinity, ease: "easeOut", delay: 0.15 * i, times: T }}
          />
        ))}
      </svg>
    </div>
  );
}
