"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * ScrollSnakeLine - A background animation component that draws a "snake-like"
 * line that grows and moves based on scroll progress of a target element.
 * 
 * @param {Object} props
 * @param {React.RefObject} props.targetRef - The ref of the container to track scroll progress.
 */
export const ScrollSnakeLine = ({ targetRef }) => {
  const [isClient, setIsClient] = useState(false);
  
  // Track scroll progress relative to the target element
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });

  // Smooth the scroll progress for a more "organic" feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 30,
    restDelta: 0.001
  });

  // Transform scroll progress into various path properties
  const pathLength = smoothProgress;
  const opacity = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0, 0.5, 0.5, 0]);
  
  // Secondary path properties
  const secondaryPathLength = useTransform(smoothProgress, (v) => v * 1.1);
  const secondaryOpacity = useTransform(opacity, (v) => v * 0.5);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setIsClient(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  if (!isClient) return null;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 1200"
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
      </svg>
    </div>
  );
};
