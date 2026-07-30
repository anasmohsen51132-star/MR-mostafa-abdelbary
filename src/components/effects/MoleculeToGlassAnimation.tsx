"use client";
// src/components/effects/MoleculeToGlassAnimation.tsx
// Signature hero visual: a glowing molecule (benzene-ring style) assembles,
// holds, then dissolves into sparks that reform as a steaming beaker of
// violet solution — mirroring the "molecular transition" reference video.
// Single dramatic pass, then settles into a quiet ambient bubble/steam loop.
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
const RISE_DUR = 0.75;         // …finishes rising + color-shift by 2.25s
const FLASH_DELAY = 2.15;      // soft reaction glow once liquid settles
const FLASH_DUR = 0.5;
const IDLE_DELAY = 2.3;        // ambient steam/bubble loop kicks in

const ATOM_COUNT = 6;
const RING_R = 34;
const RING_CX = 100;
const RING_CY = 78;

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
  { dx: 0, dy: -46 }, { dx: 40, dy: -24 }, { dx: 42, dy: 22 },
  { dx: 0, dy: 46 }, { dx: -42, dy: 22 }, { dx: -40, dy: -24 },
];

export function MoleculeToGlassAnimation({ maxWidth = 300, className = "" }: Props) {
  return (
    <div
      className={`relative mx-auto pointer-events-none select-none ${className}`}
      style={{
        width: `clamp(190px, 50vw, ${maxWidth}px)`,
        aspectRatio: "200 / 210",
      }}
    >
      <svg
        viewBox="0 0 200 210"
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
          cx="100" cy="120" rx="88" ry="60"
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
                  stroke="#00D4FF" strokeWidth="2.4" strokeLinecap="round"
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
                stroke="#00FF88" strokeWidth="1.2" strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.35 }}
                transition={{ duration: DRAW_DUR * 0.7, delay: 0.25 + i * 0.05, ease: "easeOut" }}
              />
            ))}
            {/* atoms */}
            {ATOMS.map((a, i) => (
              <motion.circle
                key={`atom-${i}`}
                cx={a.x} cy={a.y} r="6"
                fill="#0A0F1E" stroke="#00D4FF" strokeWidth="2.2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.06, ease: "backOut" }}
                style={{ transformOrigin: `${a.x}px ${a.y}px` }}
              />
            ))}
            {/* central nucleus glow */}
            <motion.circle
              cx={RING_CX} cy={RING_CY} r="5"
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
              <circle cx={RING_CX + RING_R + 10} cy={RING_CY} r="2.6" fill="#F4E9FF" />
            </motion.g>
          </motion.g>

          {/* shatter shards flung outward as the molecule breaks apart */}
          {SHARDS.map((s, i) => (
            <motion.circle
              key={`shard-${i}`}
              cx={RING_CX} cy={RING_CY} r="2.4"
              fill="#B9E9FF"
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{ opacity: [0, 0.9, 0], x: [0, s.dx], y: [0, s.dy] }}
              transition={{ duration: DISSOLVE_DUR, delay: DISSOLVE_START, ease: "easeOut" }}
            />
          ))}
        </motion.g>

        {/* ══════════════ GLASS — fades/scales in as molecule dissolves ══════════════ */}
        <motion.g
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: GLASS_DUR, delay: GLASS_START, ease: "easeOut" }}
          style={{ transformOrigin: "100px 130px" }}
        >
          {/* glass outline (tumbler, narrower base like the reference art) */}
          <path
            d="M60 42 L140 42 L131 82 L127 172 Q126 182 116 182 L84 182 Q74 182 73 172 L69 82 Z"
            fill="rgba(255,255,255,0.03)"
            stroke="rgba(122,232,255,0.55)"
            strokeWidth="2.2"
          />
          {/* rim */}
          <line x1="57" y1="42" x2="143" y2="42" stroke="rgba(122,232,255,0.6)" strokeWidth="2.2" strokeLinecap="round" />

          {/* rising, color-shifting liquid: cyan → bright violet, matching the reference */}
          <motion.path
            initial={{ opacity: 0 }}
            animate={{
              d: [
                "M96 175 L104 175 L103 178 Q102 179 99 179 L101 179 Q98 179 97 178 Z",
                "M85 140 L115 140 L112 172 Q111 179 102 179 L98 179 Q89 179 88 172 Z",
                "M72 88 L128 88 L119 172 Q118 179 108 179 L92 179 Q82 179 81 172 Z",
              ],
              fill: ["#00D4FF", "#8E7FEE", "#C46BFF"],
              opacity: [0, 1, 1],
            }}
            transition={{ duration: RISE_DUR, delay: RISE_DELAY, ease: "easeOut", times: [0, 0.5, 1] }}
          />

          {/* reaction flash once the liquid settles */}
          <motion.circle
            cx="100" cy="100" r="30"
            fill="url(#m2gFlash)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.9, 0], scale: [0.3, 1.3, 1.6] }}
            transition={{ duration: FLASH_DUR, delay: FLASH_DELAY, ease: "easeOut" }}
            style={{ transformOrigin: "100px 100px" }}
          />

          {/* ── ambient idle life once everything has settled ── */}
          {[0, 1, 2, 3].map((i) => (
            <motion.circle
              key={`bubble-${i}`}
              cx={86 + i * 10}
              r={i % 2 === 0 ? 2.2 : 1.6}
              fill="#F4E9FF"
              initial={{ opacity: 0 }}
              animate={{ cy: [174, 174, 105 - i * 5, 105 - i * 5, 174], opacity: [0, 0, 0.75, 0, 0] }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: "easeOut",
                delay: IDLE_DELAY + i * 0.35,
                times: [0, 0.05, 0.55, 0.85, 1],
              }}
            />
          ))}

          {/* three faint steam wisps drifting up from the rim, echoing the reference art */}
          {[0, 1, 2].map((i) => {
            const paths = [
              "M78 38 Q72 24 80 14 Q86 6 80 -4",
              "M100 38 Q106 24 98 14 Q92 6 98 -4",
              "M122 38 Q116 24 124 14 Q130 6 124 -4",
            ];
            return (
              <motion.path
                key={`wisp-${i}`}
                d={paths[i]}
                stroke="rgba(233,220,255,0.5)"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0], y: [0, -14] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: IDLE_DELAY + 0.4 + i * 0.9 }}
              />
            );
          })}
        </motion.g>
      </svg>
    </div>
  );
}
