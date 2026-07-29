"use client";
// src/components/effects/MixingSolutionsAnimation.tsx
// Signature hero visual: two colored solutions tilt, pour, and react inside a
// central beaker in ONE dramatic pass (flash + sparkle burst), then settles
// into a quiet ambient bubble/steam loop. Fully responsive (clamp sizing).
import { m as motion } from "framer-motion";

interface Props {
  /** Max width in px on large screens. Scales down fluidly on smaller viewports. */
  maxWidth?: number;
  className?: string;
}

// ── Timing map (seconds) ──
const POUR_DUR = 1.5;      // flasks tilt, pour, return upright
const RISE_DELAY = 0.45;   // liquid starts rising once streams land
const RISE_DUR = 1.15;     // liquid rise + color-shift finishes ~1.6s
const FLASH_DELAY = 1.55;  // reaction flash / sparkle burst
const FLASH_DUR = 0.55;
const FLASK_FADE_START = 2.1; // flasks start dissolving right after the flash
const FLASK_FADE_END = 2.6;   // …fully gone by here, clearing the way for the headline
const IDLE_DELAY = 2.05;   // ambient loop kicks in once the reaction has settled

export function MixingSolutionsAnimation({ maxWidth = 300, className = "" }: Props) {
  return (
    <div
      className={`relative mx-auto pointer-events-none select-none ${className}`}
      style={{
        width: `clamp(190px, 50vw, ${maxWidth}px)`,
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
        <defs>
          <radialGradient id="mixGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7AE8FF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#7AE8FF" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="flashBurst" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#D9A7FF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#B47AFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* soft ambient glow behind the whole scene — always alive */}
        <motion.ellipse
          cx="110" cy="120" rx="95" ry="62"
          fill="url(#mixGlow)"
          animate={{ opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* ── Left flask (cyan solution) — tilts inward once to pour, then dissolves away once spent ── */}
        <motion.g
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 1, 0] }}
          transition={{
            duration: FLASK_FADE_END,
            ease: "easeInOut",
            times: [0, FLASK_FADE_START / FLASK_FADE_END, 1],
          }}
        >
          <motion.g
            style={{ transformOrigin: "38px 70px" }}
            animate={{ rotate: [0, 0, -42, -42, 0] }}
            transition={{ duration: POUR_DUR, ease: "easeInOut", times: [0, 0.16, 0.4, 0.68, 1] }}
          >
            <path
              d="M27 15 L27 53 L7 94 Q4 103 16 103 L60 103 Q72 103 69 94 L49 53 L49 15 Z"
              fill="rgba(0,212,255,0.08)"
              stroke="#00D4FF"
              strokeWidth="2.5"
            />
            <rect x="22" y="7" width="32" height="9" rx="2" fill="rgba(0,212,255,0.16)" stroke="#00D4FF" strokeWidth="1.5" />
            <path d="M17 80 L48 80 L60 101 Q62 103 58 103 L17 103 Q11 103 13 101 Z" fill="#00D4FF" opacity="0.55" />
          </motion.g>
        </motion.g>

        {/* stream + droplets poured from the left flask */}
        <motion.path
          d="M53 99 Q74 111 92 122"
          stroke="#00D4FF" strokeWidth="3.2" strokeLinecap="round" fill="none"
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: POUR_DUR, ease: "easeInOut", times: [0.18, 0.32, 0.68, 0.82] }}
        />
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={`drop-l-${i}`}
            cx={70 + i * 8}
            r="2.6"
            fill="#00D4FF"
            animate={{ cy: [102, 122], opacity: [0, 0.9, 0] }}
            transition={{ duration: 0.5, delay: 0.4 + i * 0.14, ease: "easeIn" }}
          />
        ))}

        {/* ── Right flask (green solution) — tilts inward once to pour, then dissolves away once spent ── */}
        <motion.g
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 1, 0] }}
          transition={{
            duration: FLASK_FADE_END,
            ease: "easeInOut",
            times: [0, FLASK_FADE_START / FLASK_FADE_END, 1],
          }}
        >
          <motion.g
            style={{ transformOrigin: "182px 70px" }}
            animate={{ rotate: [0, 0, 42, 42, 0] }}
            transition={{ duration: POUR_DUR, ease: "easeInOut", times: [0, 0.16, 0.4, 0.68, 1] }}
          >
            <path
              d="M193 15 L193 53 L213 94 Q216 103 204 103 L160 103 Q148 103 151 94 L171 53 L171 15 Z"
              fill="rgba(0,255,136,0.08)"
              stroke="#00FF88"
              strokeWidth="2.5"
            />
            <rect x="166" y="7" width="32" height="9" rx="2" fill="rgba(0,255,136,0.16)" stroke="#00FF88" strokeWidth="1.5" />
            <path d="M172 80 L203 80 L207 101 Q209 103 203 103 L162 103 Q158 103 160 101 Z" fill="#00FF88" opacity="0.55" />
          </motion.g>
        </motion.g>

        {/* stream + droplets poured from the right flask */}
        <motion.path
          d="M167 99 Q146 111 128 122"
          stroke="#00FF88" strokeWidth="3.2" strokeLinecap="round" fill="none"
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: POUR_DUR, ease: "easeInOut", times: [0.18, 0.32, 0.68, 0.82] }}
        />
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={`drop-r-${i}`}
            cx={150 - i * 8}
            r="2.6"
            fill="#00FF88"
            animate={{ cy: [102, 122], opacity: [0, 0.9, 0] }}
            transition={{ duration: 0.5, delay: 0.4 + i * 0.14, ease: "easeIn" }}
          />
        ))}

        {/* ── Central beaker receiving + mixing the two solutions ── */}
        <path
          d="M76 122 L144 122 L136 176 Q135 182 128 182 L92 182 Q85 182 84 176 Z"
          fill="rgba(255,255,255,0.03)"
          stroke="rgba(122,232,255,0.55)"
          strokeWidth="2.2"
        />
        <line x1="71" y1="122" x2="149" y2="122" stroke="rgba(122,232,255,0.55)" strokeWidth="2.2" strokeLinecap="round" />

        {/* rising, color-shifting liquid: cyan + green react into a bright violet */}
        <motion.path
          initial={{ opacity: 0 }}
          animate={{
            d: [
              "M90 172 L130 172 L129 176 Q128 179 124 179 L96 179 Q92 179 91 176 Z",
              "M84 155 L136 155 L130 176 Q129 179 125 179 L95 179 Q91 179 90 176 Z",
              "M79 136 L141 136 L131 176 Q130 179 126 179 L94 179 Q90 179 89 176 Z",
            ],
            fill: ["#00D4FF", "#7FC7EE", "#C46BFF"],
            opacity: [0, 1, 1],
          }}
          transition={{ duration: RISE_DUR, delay: RISE_DELAY, ease: "easeOut", times: [0, 0.5, 1] }}
        />

        {/* expanding ripple ring at the moment the reaction fires */}
        <motion.ellipse
          cx="110" cy="136" rx="4" ry="2"
          fill="none" stroke="#E8C6FF" strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={{ rx: [4, 34], ry: [2, 12], opacity: [0, 0.8, 0] }}
          transition={{ duration: FLASH_DUR, delay: FLASH_DELAY, ease: "easeOut" }}
        />

        {/* reaction flash burst */}
        <motion.circle
          cx="110" cy="136" r="30"
          fill="url(#flashBurst)"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0.2, 1.3, 1.6] }}
          transition={{ duration: FLASH_DUR, delay: FLASH_DELAY, ease: "easeOut" }}
          style={{ transformOrigin: "110px 136px" }}
        />

        {/* sparkle burst — six tiny stars flung outward from the reaction point */}
        {[
          { dx: 0, dy: -34 }, { dx: 30, dy: -18 }, { dx: 32, dy: 16 },
          { dx: 0, dy: 32 }, { dx: -32, dy: 16 }, { dx: -30, dy: -18 },
        ].map((s, i) => (
          <motion.path
            key={`spark-${i}`}
            d="M0 -4 L1.2 -1.2 L4 0 L1.2 1.2 L0 4 L-1.2 1.2 L-4 0 L-1.2 -1.2 Z"
            fill="#F4E9FF"
            initial={{ x: 110, y: 136, opacity: 0, scale: 0.3 }}
            animate={{ x: 110 + s.dx, y: 136 + s.dy, opacity: [0, 1, 0], scale: [0.3, 1.1, 0.4] }}
            transition={{ duration: 0.7, delay: FLASH_DELAY + 0.03 * i, ease: "easeOut" }}
          />
        ))}

        {/* ── Ambient idle life once the reaction has settled ── */}
        {[0, 1, 2, 3].map((i) => (
          <motion.circle
            key={`bubble-${i}`}
            cx={96 + i * 11}
            r={i % 2 === 0 ? 2.3 : 1.7}
            fill="#F4E9FF"
            initial={{ opacity: 0 }}
            animate={{ cy: [176, 176, 144 - i * 5, 144 - i * 5, 176], opacity: [0, 0, 0.75, 0, 0] }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: "easeOut",
              delay: IDLE_DELAY + i * 0.35,
              times: [0, 0.05, 0.55, 0.85, 1],
            }}
          />
        ))}

        {/* two faint steam wisps drifting up from the beaker */}
        {[0, 1].map((i) => (
          <motion.path
            key={`wisp-${i}`}
            d={i === 0 ? "M100 130 Q94 118 102 108 Q108 100 102 90" : "M124 130 Q130 118 122 108 Q116 100 122 90"}
            stroke="rgba(233,220,255,0.5)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0], y: [0, -14] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: IDLE_DELAY + 0.6 + i * 1.2 }}
          />
        ))}
      </svg>
    </div>
  );
}
