"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * ScrollSnakeLine - A background animation component that draws a "snake-like"
 * line that grows and moves based on scroll progress.
 */
export const ScrollSnakeLine = () => {
  const [isClient, setIsClient] = useState(false);
  const { scrollYProgress } = useScroll();

  // Smooth the scroll progress for a more "organic" feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  });

  // Transform scroll progress into various path properties
  // ALL HOOKS MUST BE DECLARED HERE, BEFORE ANY CONDITIONAL RETURNS
  const pathLength = smoothProgress;
  const opacity = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0, 0.3, 0.3, 0]);
  
  // Secondary path properties
  const secondaryPathLength = useTransform(smoothProgress, (v) => v * 1.1);
  const secondaryOpacity = useTransform(opacity, (v) => v * 0.5);

  // Floating head properties
  const headX = useTransform(smoothProgress, [0, 1], [10, 50]);
  const headY = useTransform(smoothProgress, [0, 1], [0, 1000]);
  const headScale = useTransform(smoothProgress, [0, 0.1], [0, 1]);

  // Glow properties
  const glowX = useTransform(smoothProgress, [0, 1], ["10%", "50%"]);
  const glowY = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 1000"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main Snake Path */}
        <motion.path
          d="M 10 0 C 30 100 70 200 80 300 C 90 400 40 500 20 600 C 0 700 50 800 70 900 C 90 1000 60 1100 50 1200"
          stroke="var(--accent)"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeDasharray="1 2"
          style={{
            pathLength,
            opacity
          }}
        />

        {/* Secondary thinner path for depth */}
        <motion.path
          d="M 90 0 C 70 150 30 250 20 350 C 10 450 60 550 80 650 C 100 750 50 850 30 950 C 10 1050 40 1150 50 1250"
          stroke="var(--primary)"
          strokeWidth="0.2"
          strokeLinecap="round"
          style={{
            pathLength: secondaryPathLength,
            opacity: secondaryOpacity
          }}
        />

        {/* Floating "head" of the snake */}
        <motion.circle
          cx={headX}
          cy={headY}
          r="0.8"
          fill="var(--accent)"
          style={{ 
            opacity,
            scale: headScale
          }}
        />
      </svg>
      
      {/* Subtle Glow at the snake head */}
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-accent/10 blur-[80px]"
        style={{
          left: glowX,
          top: glowY,
          x: "-50%",
          y: "-50%",
          opacity
        }}
      />
    </div>
  );
};
