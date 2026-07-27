"use client";
// src/components/effects/TwinklingStars.tsx
// ✦ Chemistry Edition — twinkling electrons & energy particles
import { m as motion } from "framer-motion";

interface Star {
  x: string;
  y: string;
  size: number;
  duration: number;
  delay: number;
  shape?: string;
}

const DEFAULT_STARS: Star[] = [
  { x: "12%", y: "10%", size: 6,  duration: 3.2, delay: 0,    shape: "●" },
  { x: "88%", y: "22%", size: 5,  duration: 2.6, delay: 0.6,  shape: "◆" },
  { x: "64%", y: "8%",  size: 7,  duration: 3.6, delay: 1.2,  shape: "●" },
  { x: "4%",  y: "34%", size: 4,  duration: 2.9, delay: 1.8,  shape: "◆" },
  { x: "95%", y: "48%", size: 6,  duration: 3.1, delay: 0.4,  shape: "●" },
  { x: "22%", y: "52%", size: 5,  duration: 2.4, delay: 2.4,  shape: "◆" },
  { x: "78%", y: "70%", size: 7,  duration: 3.4, delay: 0.9,  shape: "●" },
  { x: "36%", y: "76%", size: 4,  duration: 2.7, delay: 1.6,  shape: "◆" },
  { x: "6%",  y: "82%", size: 6,  duration: 3.0, delay: 2.1,  shape: "●" },
  { x: "52%", y: "90%", size: 5,  duration: 2.5, delay: 0.2,  shape: "◆" },
  { x: "70%", y: "38%", size: 4,  duration: 2.8, delay: 1.4,  shape: "●" },
  { x: "42%", y: "30%", size: 6,  duration: 3.3, delay: 2.7,  shape: "◆" },
  { x: "92%", y: "88%", size: 5,  duration: 2.6, delay: 1.0,  shape: "●" },
  { x: "16%", y: "66%", size: 4,  duration: 3.5, delay: 0.7,  shape: "◆" },
];

interface Props {
  stars?: Star[];
  density?: number;
  color?: string;
  maxOpacity?: number;
}

export function TwinklingStars({
  stars,
  density,
  color = "0,212,255",
  maxOpacity = 0.6,
}: Props) {
  const set = stars ?? (density ? DEFAULT_STARS.slice(0, density) : DEFAULT_STARS);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {set.map((s, i) => (
        <motion.span
          key={i}
          className="absolute select-none"
          style={{
            left: s.x,
            top: s.y,
            fontSize: s.size,
            color: `rgba(${color},${maxOpacity * 0.5})`,
            lineHeight: 1,
            willChange: "transform, opacity",
          }}
          animate={{
            opacity: [maxOpacity * 0.2, maxOpacity, maxOpacity * 0.2],
            scale:   [0.6, 1.4, 0.6],
            rotate:  [0, 180, 360],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: s.delay,
          }}
        >
          {s.shape ?? "●"}
        </motion.span>
      ))}
    </div>
  );
}
