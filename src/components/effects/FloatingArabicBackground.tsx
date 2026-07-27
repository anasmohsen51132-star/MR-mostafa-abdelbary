"use client";
// src/components/effects/FloatingArabicBackground.tsx
// ✦ Chemistry Edition — floating atoms, molecules, chemical symbols
import { m as motion } from "framer-motion";

interface FloatingSymbol {
  char: string;
  top: string;
  left?: string;
  right?: string;
  size: number;
}

// Chemical symbols & molecular formulas instead of Arabic letters
const DEFAULT_SYMBOLS: FloatingSymbol[] = [
  { char: "H₂O",  top: "10%", right: "5%",  size: 28 },
  { char: "⬡",    top: "20%", left: "8%",   size: 44 }, // benzene ring
  { char: "CO₂",  top: "50%", right: "3%",  size: 26 },
  { char: "NaCl", top: "70%", left: "5%",   size: 22 },
  { char: "⚛",    top: "85%", right: "10%", size: 48 }, // atom symbol
  { char: "NH₃",  top: "35%", left: "2%",   size: 24 },
  { char: "CH₄",  top: "60%", right: "15%", size: 26 },
  { char: "Fe",   top: "15%", left: "20%",  size: 36 },
  { char: "O₂",   top: "75%", right: "25%", size: 30 },
  { char: "∞",    top: "40%", right: "30%", size: 38 },
  { char: "CaCO₃",top: "90%", left: "15%",  size: 20 },
  { char: "⬡",    top: "25%", right: "40%", size: 40 },
];

interface Props {
  letters?: FloatingSymbol[];
  density?: number;
  color?: string;
}

export function FloatingArabicBackground({
  letters,
  density,
  color = "rgba(0,212,255,0.10)",
}: Props) {
  const set = letters ?? (density ? DEFAULT_SYMBOLS.slice(0, density) : DEFAULT_SYMBOLS);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {set.map((s, i) => (
        <motion.span
          key={i}
          className="absolute select-none font-mono"
          style={{
            top: s.top,
            left: s.left,
            right: s.right,
            fontSize: s.size,
            color,
            lineHeight: 1,
            willChange: "transform",
            fontFamily: "'Cairo', monospace",
            fontWeight: 600,
            letterSpacing: "0.02em",
          }}
          animate={{
            y: [0, -14, -6, 0],
            rotate: [0, 4, -3, 0],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 6 + i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        >
          {s.char}
        </motion.span>
      ))}
    </div>
  );
}
