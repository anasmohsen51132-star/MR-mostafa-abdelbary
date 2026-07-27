"use client";
// src/components/dashboard/WelcomeAnimation.tsx — Chemistry Edition
import { m as motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface Props {
  name: string;
  onDone?: () => void;
}

export function WelcomeAnimation({ name, onDone }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let id = setTimeout(() => {
      setVisible(false);
      id = setTimeout(() => onDone?.(), 600);
    }, 2800);
    return () => clearTimeout(id);
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#0A0F1E,#0D1528)" }}
        >
          {/* Dot grid */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: `radial-gradient(circle, rgba(0,212,255,0.06) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }} />

          {/* Glow orb */}
          <motion.div
            className="absolute w-72 h-72 rounded-full"
            style={{ background: "radial-gradient(circle,rgba(0,212,255,0.18),transparent 70%)" }}
            animate={{ scale: [0.7, 1.6, 0.7] }}
            transition={{ duration: 2.8, ease: "easeInOut" }}
          />

          {/* Orbiting electrons */}
          <motion.div
            className="absolute w-52 h-52 rounded-full"
            style={{ border: "1px solid rgba(0,212,255,0.25)" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
              style={{ background: "#00D4FF", boxShadow: "0 0 10px #00D4FF" }} />
          </motion.div>
          <motion.div
            className="absolute w-72 h-72 rounded-full"
            style={{ border: "1px solid rgba(0,255,136,0.15)", transform: "rotateX(70deg)" }}
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
              style={{ background: "#00FF88", boxShadow: "0 0 8px #00FF88" }} />
          </motion.div>

          {/* Content */}
          <div className="relative z-10 text-center px-8">
            {/* Atom icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, type: "spring", stiffness: 260, damping: 14 }}
              style={{ fontSize: 56, marginBottom: 12 }}
            >
              ⚛️
            </motion.div>

            {/* Welcome */}
            <motion.h1
              initial={{ opacity: 0, y: 36, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.35 }}
              style={{
                fontFamily: "Cairo,sans-serif",
                fontWeight: 900,
                color: "#FFFFFF",
                fontSize: "clamp(28px,6vw,52px)",
                marginBottom: 8,
              }}
            >
              أهلاً وسهلاً
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              style={{
                fontFamily: "Cairo,sans-serif",
                color: "#7AE8FF",
                fontSize: "clamp(18px,4vw,32px)",
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              {name}
            </motion.h2>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              style={{
                height: 2,
                background: "linear-gradient(90deg,transparent,#00D4FF,transparent)",
                marginBottom: 16,
              }}
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              style={{
                fontFamily: "Cairo,sans-serif",
                color: "rgba(0,212,255,0.5)",
                fontSize: 15,
              }}
            >
              مرحباً بك في رحلة تعلم الكيمياء ⚗️
            </motion.p>

            {/* Loading dots */}
            <motion.div
              className="flex justify-center gap-2 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ background: "#00D4FF" }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.8, delay: i * 0.2, repeat: Infinity }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
