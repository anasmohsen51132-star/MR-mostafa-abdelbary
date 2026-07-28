"use client";
// src/components/effects/FloatingChemistryBackground.tsx
// Ambient background: chemical formulas & symbols drifting slowly behind the
// hero content — replaces the old Arabic-language-teaching floating text.
import { m as motion } from "framer-motion";

interface Item {
  label: string;
  top: string;
  left: string;
  size: number;
  duration: number;
  delay: number;
  color: string;
  hideOnMobile?: boolean;
}

const ITEMS: Item[] = [
  { label: "NaCl",     top: "13%", left: "6%",  size: 22, duration: 22, delay: 0,   color: "#00D4FF" },
  { label: "H₂O",      top: "60%", left: "5%",  size: 26, duration: 26, delay: 2.4, color: "#00FF88" },
  { label: "CO₂",      top: "80%", left: "13%", size: 18, duration: 20, delay: 5,   color: "#7AE8FF" },
  { label: "CH₄",      top: "48%", left: "2%",  size: 16, duration: 25, delay: 7.5, color: "#00FF88", hideOnMobile: true },
  { label: "C₆H₁₂O₆",  top: "18%", left: "82%", size: 16, duration: 28, delay: 1,   color: "#00D4FF", hideOnMobile: true },
  { label: "O₂",       top: "7%",  left: "68%", size: 22, duration: 18, delay: 3.6, color: "#00FF88" },
  { label: "Na⁺",      top: "38%", left: "90%", size: 20, duration: 24, delay: 1.8, color: "#7AE8FF", hideOnMobile: true },
  { label: "Fe",       top: "70%", left: "87%", size: 22, duration: 21, delay: 4.5, color: "#00D4FF" },
  { label: "pH",       top: "88%", left: "58%", size: 18, duration: 19, delay: 2,   color: "#7AE8FF" },
  { label: "K",        top: "28%", left: "94%", size: 22, duration: 23, delay: 6,   color: "#00D4FF", hideOnMobile: true },
  { label: "NH₃",      top: "10%", left: "38%", size: 14, duration: 27, delay: 8,   color: "#00FF88", hideOnMobile: true },
  { label: "Mg",       top: "91%", left: "30%", size: 18, duration: 20, delay: 1.2, color: "#7AE8FF" },
];

export function FloatingChemistryBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" style={{ zIndex: 1 }}>
      {ITEMS.map((item, i) => (
        <motion.span
          key={i}
          className={item.hideOnMobile ? "hidden sm:inline-block absolute font-bold" : "absolute font-bold"}
          style={{
            top: item.top,
            left: item.left,
            fontSize: `clamp(${Math.max(10, item.size - 6)}px, ${(item.size / 10).toFixed(1)}vw, ${item.size}px)`,
            color: item.color,
            fontFamily: "Cairo, sans-serif",
            letterSpacing: 1,
          }}
          animate={{
            y: [0, -24, 0],
            opacity: [0.08, 0.2, 0.08],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: item.delay,
          }}
        >
          {item.label}
        </motion.span>
      ))}
    </div>
  );
}
