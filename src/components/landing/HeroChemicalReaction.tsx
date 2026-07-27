// src/components/landing/HeroChemicalReaction.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface HeroChemicalReactionProps {
  teacherName: string;
  tagline: string;
  onComplete?: () => void;
}

const HeroChemicalReaction: React.FC<HeroChemicalReactionProps> = ({ 
  teacherName, 
  tagline, 
  onComplete 
}) => {
  const [phase, setPhase] = useState<'initial' | 'pouring' | 'reaction' | 'complete'>('initial');
  const [particles, setParticles] = useState<Array<{ x: number; y: number; size: number; delay: number }>>([]);

  useEffect(() => {
    // Start the animation sequence
    const timers: NodeJS.Timeout[] = [];

    timers.push(setTimeout(() => {
      setPhase('pouring');
    }, 500));

    timers.push(setTimeout(() => {
      setPhase('reaction');
      // Generate particles for the reaction
      const newParticles = Array.from({ length: 30 }).map(() => ({
        x: 50 + (Math.random() - 0.5) * 60,
        y: 50 + (Math.random() - 0.5) * 60,
        size: 2 + Math.random() * 6,
        delay: Math.random() * 0.5,
      }));
      setParticles(newParticles);
    }, 2000));

    timers.push(setTimeout(() => {
      setPhase('complete');
      if (onComplete) onComplete();
    }, 4000));

    return () => timers.forEach(t => clearTimeout(t));
  }, [onComplete]);

  return (
    <motion.div 
      className="relative mx-auto" 
      style={{ 
        width: "min(400px, 80vw)", 
        height: "min(300px, 60vh)",
        maxWidth: "500px",
        maxHeight: "400px",
      }}
    >
      <svg className="w-full h-full" viewBox="0 0 400 300" fill="none" xmlns="
