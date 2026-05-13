"use client";

import { motion } from "framer-motion";
import { techStackImages, techStackNames } from "@/data/aboutData";
import { useMemo } from "react";

// --- ANIMATION CONFIGURATION ---
// Set to true to play animations ONLY ONE TIME when section is first seen.
// Set to false to replay animations EVERY TIME you scroll into the section.
const ANIMATE_ONCE = true; 

export function TechStackSection() {
  const allTechItems = useMemo(() => {
    const categories = Object.keys(techStackNames);
    return categories.flatMap((cat) =>
      techStackNames[cat].map((name, idx) => ({
        name,
        image: techStackImages[cat][idx % techStackImages[cat].length],
        category: cat.charAt(0).toUpperCase() + cat.slice(1),
      }))
    ).map((item, i, arr) => {
      const layer = i % 4;
      const lengths = [22, 30, 38, 46];
      const length = lengths[layer];
      const angle = (i * 360) / arr.length;
      return { ...item, layer, length, angle };
    });
  }, []);

  // Animation timing
  const lineDuration = 2.0;
  const staggerDelay = 0.15;

  return (
    <section className="relative py-12 lg:py-32 bg-primary overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--color-accent)_1px,transparent_1px)] bg-size-[40px_40px]" />
      </div>

      {/* Decorative Illustrations */}
      <motion.img
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 0.8, x: 0 }}
        animate={{ y: [0, 10, 0] }}
        transition={{ 
          x: { duration: 1 }, 
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" } 
        }}
        viewport={{ once: ANIMATE_ONCE }}
        src="/landing/man_coding.webp"
        alt="Developer Illustration"
        className="absolute top-40 md:top-96 left-10 w-48 md:w-72 h-auto pointer-events-none z-0 hidden lg:block"
      />

      <motion.img
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 0.8, x: 0 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ 
          x: { duration: 1 }, 
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" } 
        }}
        viewport={{ once: ANIMATE_ONCE }}
        src="/landing/coding illustration.png"
        alt="Coding Illustration"
        className="absolute bottom-10 right-10 w-64 md:w-96 h-auto pointer-events-none z-0 hidden lg:block"
      />

      <div className="mx-auto max-w-7xl px-6 relative z-10 text-center mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: ANIMATE_ONCE }}
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="section-label">Technology Stack</span>
          </div>
          <h3 className="text-3xl lg:text-5xl font-bold text-text-light mb-6 tracking-tight">
            Modern Tech Stack for <span className="text-accent">Future-Ready</span> Solutions
          </h3>
          <p className="text-text-muted max-w-2xl mx-auto">
             A comprehensive ecosystem of 35+ cutting-edge technologies powering scalable, high-performance digital products.
          </p>
        </motion.div>
      </div>

      <div className="relative w-full aspect-square max-w-250 mx-auto flex items-center justify-center scale-90 md:scale-100">
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          <defs>
            <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.05" />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.4" />
            </linearGradient>
            <filter id="glow-node">
              <feGaussianBlur stdDeviation="0.4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {allTechItems.map((item, i) => {
            const rad = (item.angle * Math.PI) / 180;
            const x2 = 50 + Math.cos(rad) * item.length;
            const y2 = 50 + Math.sin(rad) * item.length;
            
            return (
              <g key={i}>
                <motion.line
                  x1="50"
                  y1="50"
                  x2={x2}
                  y2={y2}
                  stroke="url(#line-grad)"
                  strokeWidth="0.2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  transition={{ 
                    duration: lineDuration, 
                    delay: i * staggerDelay, 
                    ease: "easeInOut" 
                  }}
                  viewport={{ once: ANIMATE_ONCE }}
                />
                <motion.circle
                  cx={x2}
                  cy={y2}
                  r="0.4"
                  fill="var(--color-accent)"
                  filter="url(#glow-node)"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: (i * staggerDelay) + lineDuration,
                    duration: 0.3
                  }}
                  viewport={{ once: ANIMATE_ONCE }}
                />
              </g>
            );
          })}
        </svg>

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: ANIMATE_ONCE }}
          transition={{ duration: 0.8, type: "spring" }}
          className="relative z-20 w-24 h-40 md:w-28 md:h-52 flex items-center justify-center"
        >
          <div className="absolute inset-0 border border-accent/20 rounded-xl" />
          <div className="absolute inset-1 border-2 border-accent rounded-lg flex items-center justify-center bg-primary/95 backdrop-blur-2xl shadow-[0_0_50px_rgba(212,160,23,0.1)]">
            <span className="font-heading font-black text-xs md:text-sm text-white text-center vertical-text tracking-[0.4em]">
              TECH ENGINE
            </span>
          </div>
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute inset-0 bg-accent/40 blur-3xl rounded-xl -z-10" 
          />
        </motion.div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {allTechItems.map((item, i) => {
            const rad = (item.angle * Math.PI) / 180;
            return (
              <motion.div
                key={`${item.name}-${i}`}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                whileInView={{ 
                  opacity: 1, 
                  scale: 1,
                  x: Math.cos(rad) * (item.length * 10),
                  y: Math.sin(rad) * (item.length * 10)
                }}
                transition={{ 
                  delay: (i * staggerDelay) + lineDuration, 
                  type: "spring", 
                  stiffness: 120,
                  damping: 12
                }}
                viewport={{ once: ANIMATE_ONCE }}
                className="absolute pointer-events-auto group"
              >
                <div className="relative">
                  <motion.div 
                    animate={{ y: [0, -6, 0], x: [0, 4, 0] }}
                    transition={{ duration: 4 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
                    className="w-10 h-10 md:w-18 md:h-18 bg-primary/90 backdrop-blur-xl border border-white/5 rounded-full flex items-center justify-center p-1.5 group-hover:border-accent group-hover:bg-accent/10 group-hover:shadow-[0_0_20px_rgba(212,160,23,0.3)] transition-all duration-500"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain transition-all duration-500  group-hover:scale-115"
                    />
                  </motion.div>
                  
                  <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gray-900/90 border border-accent/20 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md whitespace-nowrap shadow-2xl backdrop-blur-sm z-50">
                    {item.name}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: uppercase;
          transform: rotate(180deg);
          white-space: nowrap;
        }
      `}</style>
    </section>
  );
}

