"use client";
// src/components/effects/MoleculeToGlassAnimation.tsx
// Signature hero visual: a glowing molecule (benzene-ring style) assembles,
// holds, then dissolves into sparks that reform as a steaming beaker of
// violet solution — mirroring the "molecular transition" reference video.
// The beaker is the site's original wide/short shape (not a tall tumbler).
// Once settled, the beaker outline stays perfectly still while the liquid
// inside slowly cycles through a few reaction colors, forever.
// Fully responsive: SVG + clamp() sizing, so it scales cleanly on phone,
// tablet, and laptop without any fixed pixel widths.
import { m as motion } from "framer-motion";

interface Props {
  /** Max width in px on large screens. Scales down fluidly on smaller viewports. */
  maxWidth?: number;
  className?: string;
}

// ── Timing map (seconds) ──
const DRAW_DUR = 0.9;          // molecule bonds draw in, atoms pop in
const HOLD_UNTIL = 1.1;        // molecule sits fully formed, slowly rotating
const DISSOLVE_START = 1.1;    // molecule starts breaking apart
const DISSOLVE_DUR = 0.7;      // …fully gone by 1.8s
const GLASS_START = 1.15;      // glass outline begins fading/scaling in
const GLASS_DUR = 0.65;        // …fully formed by 1.8s
const RISE_DELAY = 1.5;        // liquid begins filling the glass
const RISE_DUR = 0.75;         // …finishes rising + first color-shift by 2.25s
const FLASH_DELAY = 2.15;      // soft reaction glow once liquid settles
const FLASH_DUR = 0.5;
const IDLE_DELAY = 2.3;        // ambient steam/bubble loop kicks in
const COLOR_CYCLE_START = 2.3; // liquid begins its slow endless color drift
const COLOR_CYCLE_DUR = 9;     // one full trip through the palette

const ATOM_COUNT = 6;
const RING_R = 28;
const RING_CX = 110;
const RING_CY = 55;

// Precompute hexagon atom positions once (no need to recalc per render)
const ATOMS = Array.from({ length: ATOM_COUNT }, (_, i) => {
  const angle = (Math.PI / 3) * i - Math.PI / 2;
  return {
    x: RING_CX + RING_R * Math.cos(angle),
    y: RING_CY + RING_R * Math.sin(angle),
  };
});

// Shatter particles flung outward from the molecule when it dissolves
const SHARDS = [
  { dx: 0, dy: -40 }, { dx: 34, dy: -20 }, { dx: 36, dy: 19 },
  { dx: 0, dy: 40 }, { dx: -36, dy: 19 }, { dx: -34, dy: -20 },
];

// Liquid shape — wide, short beaker fill (empty → mid → full)
const LIQUID_D = [
  "M90 172 L130 172 L129 176 Q128 179 124 179 L96 179 Q92 179 91 176 Z",
  "M84 155 L136 155 L130 176 Q129 179 125 179 L95 179 Q91 179 90 176 Z",
  "M79 136 L141 136 L131 176 Q130 179 126 179 L94 179 Q90 179 89 176 Z",
];
const LIQUID_FULL_D = LIQUID_D[2];

// Endless reaction-color drift for the settled liquid (shape never changes)
const COLOR_CYCLE = ["#C46BFF", "#00D4FF", "#00FF88", "#FF7AC6", "#C46BFF"];

export function MoleculeToGlassAnimation({ maxWidth = 260, className = "" }: Props) {
  return (
    <div
      className={`relative mx-auto pointer-events-none select-none ${className}`}
      style={{
        width: `clamp(170px, 46vw, ${maxWidth}px)`,
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
          <radialGradient id="m2gGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7AE8FF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#7AE8FF" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="m2gFlash" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#D9A7FF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#B47AFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* soft ambient glow behind the whole scene — always alive */}
        <motion.ellipse
          cx="110" cy="120" rx="95" ry="60"
          fill="url(#m2gGlow)"
          animate={{ opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* ══════════════ MOLECULE — draws in, holds, dissolves ══════════════ */}
        <motion.g
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: [1, 1, 0], scale: [1, 1, 0.55] }}
          transition={{
            duration: DISSOLVE_START + DISSOLVE_DUR,
            ease: "easeInOut",
            times: [0, DISSOLVE_START / (DISSOLVE_START + DISSOLVE_DUR), 1],
          }}
          style={{ transformOrigin: `${RING_CX}px ${RING_CY}px` }}
        >
          {/* slow idle spin while it's held on screen */}
          <motion.g
            animate={{ rotate: [0, 12] }}
            transition={{ duration: HOLD_UNTIL + 0.3, ease: "easeInOut" }}
            style={{ transformOrigin: `${RING_CX}px ${RING_CY}px` }}
          >
            {/* bonds — ring */}
            {ATOMS.map((a, i) => {
              const b = ATOMS[(i + 1) % ATOM_COUNT];
              return (
                <motion.line
                  key={`bond-${i}`}
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke="#00D4FF" strokeWidth="2.2" strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.85 }}
                  transition={{ duration: DRAW_DUR * 0.7, delay: i * 0.06, ease: "easeOut" }}
                />
              );
            })}
            {/* bonds — spokes to center (inner "electron cloud" lines) */}
            {ATOMS.map((a, i) => (
              <motion.line
                key={`spoke-${i}`}
                x1={RING_CX} y1={RING_CY} x2={a.x} y2={a.y}
                stroke="#00FF88" strokeWidth="1.1" strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.35 }}
                transition={{ duration: DRAW_DUR * 0.7, delay: 0.25 + i * 0.05, ease: "easeOut" }}
              />
            ))}
            {/* atoms */}
            {ATOMS.map((a, i) => (
              <motion.circle
                key={`atom-${i}`}
                cx={a.x} cy={a.y} r="5.2"
                fill="#0A0F1E" stroke="#00D4FF" strokeWidth="2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.06, ease: "backOut" }}
                style={{ transformOrigin: `${a.x}px ${a.y}px` }}
              />
            ))}
            {/* central nucleus glow */}
            <motion.circle
              cx={RING_CX} cy={RING_CY} r="4.4"
              fill="#7AE8FF"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0.7], scale: [0, 1.2, 1] }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            />
            {/* orbiting electron */}
            <motion.g
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: `${RING_CX}px ${RING_CY}px` }}
            >
              <circle cx={RING_CX + RING_R + 9} cy={RING_CY} r="2.3" fill="#F4E9FF" />
            </motion.g>
          </motion.g>

          {/* shatter shards flung outward as the molecule breaks apart */}
          {SHARDS.map((s, i) => (
            <motion.circle
              key={`shard-${i}`}
              cx={RING_CX} cy={RING_CY} r="2.2"
              fill="#B9E9FF"
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{ opacity: [0, 0.9, 0], x: [0, s.dx], y: [0, s.dy] }}
              transition={{ duration: DISSOLVE_DUR, delay: DISSOLVE_START, ease: "easeOut" }}
            />
          ))}
        </motion.g>

        {/* ══════════════ GLASS — wide/short beaker, fades in as molecule dissolves ══════════════ */}
        <motion.g
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: GLASS_DUR, delay: GLASS_START, ease: "easeOut" }}
          style={{ transformOrigin: "110px 130px" }}
        >
          {/* beaker outline — the site's original wide/short shape; it never
              animates its own geometry again once drawn, only the liquid does */}
          <path
            d="M76 122 L144 122 L136 176 Q135 182 128 182 L92 182 Q85 182 84 176 Z"
            fill="rgba(255,255,255,0.03)"
            stroke="rgba(122,232,255,0.55)"
            strokeWidth="2.2"
          />
          <line x1="71" y1="122" x2="149" y2="122" stroke="rgba(122,232,255,0.55)" strokeWidth="2.2" strokeLinecap="round" />

          {/* liquid rising into place, cyan → violet */}
          <motion.path
            initial={{ opacity: 0 }}
            animate={{
              d: LIQUID_D,
              fill: ["#00D4FF", "#8E7FEE", COLOR_CYCLE[0]],
              opacity: [0, 1, 1],
            }}
            transition={{ duration: RISE_DUR, delay: RISE_DELAY, ease: "easeOut", times: [0, 0.5, 1] }}
          />

          {/* once settled: shape is 100% fixed (LIQUID_FULL_D, static) — only
              its color drifts slowly and endlessly through reaction hues */}
          <motion.path
            d={LIQUID_FULL_D}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, fill: COLOR_CYCLE }}
            transition={{
              opacity: { duration: 0.01, delay: RISE_DELAY + RISE_DUR },
              fill: { duration: COLOR_CYCLE_DUR, delay: COLOR_CYCLE_START, repeat: Infinity, ease: "easeInOut" },
            }}
          />

          {/* reaction flash once the liquid settles */}
          <motion.circle
            cx="110" cy="136" r="30"
            fill="url(#m2gFlash)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.9, 0], scale: [0.3, 1.3, 1.6] }}
            transition={{ duration: FLASH_DUR, delay: FLASH_DELAY, ease: "easeOut" }}
            style={{ transformOrigin: "110px 136px" }}
          />

          {/* ── ambient idle life once everything has settled ── */}
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
        </motion.g>
      </svg>
    </div>
  );
}
