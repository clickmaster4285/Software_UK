"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Clock } from "lucide-react";

export default function ExpandOnHover({
  images,
  phases,
  defaultExpandedIndex = 0,
  containerHeight = "32rem",
}) {
  const [expandedIndex, setExpandedIndex] = useState(defaultExpandedIndex);

  return (
    <motion.div
      className="flex flex-col lg:flex-row w-full gap-3 md:gap-4"
      style={{ minHeight: containerHeight }}
      layout
    >
      {phases.map((phase, index) => {
        const isExpanded = expandedIndex === index;
        const Icon = phase.icon;

        return (
          <motion.div
            key={`${phase.step}-${phase.title}`}
            layout
            onMouseEnter={() => setExpandedIndex(index)}
            onFocus={() => setExpandedIndex(index)}
            onClick={() => setExpandedIndex(index)}
            tabIndex={0}
            role="button"
            aria-expanded={isExpanded}
            aria-label={`${phase.title} — step ${phase.step}`}
            className={`relative flex flex-col transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer overflow-hidden rounded-2xl border outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
              isExpanded
                ? "flex-4 border-primary/30 bg-primary text-text-light shadow-[0_12px_40px_rgba(0,0,0,0.18)]"
                : "flex-1 border-border bg-white hover:border-accent/40 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
            }`}
          >
            {/* Background image — expanded */}
            <AnimatePresence>
              {isExpanded && images[index] && (
                <motion.div
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 }}
                  className="absolute inset-0 z-0"
                >
                  <Image
                    src={images[index]}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 800px"
                    className="object-cover opacity-25"
                  />
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(165deg, color-mix(in oklch, var(--primary) 92%, transparent) 0%, color-mix(in oklch, var(--primary-mid) 85%, transparent) 45%, color-mix(in oklch, var(--accent) 35%, transparent) 100%)",
                    }}
                    initial={{ opacity: 0.85 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative z-10 flex h-full flex-col p-5 md:p-7 lg:p-8">
              {/* Icon row */}
              <motion.div
                className={`flex items-start gap-3 md:gap-4 mb-4 md:mb-6 ${
                  isExpanded ? "text-text-light" : "text-text-primary"
                }`}
                layout
              >
                <motion.div
                  layout
                  className={`flex h-11 w-11 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                    isExpanded
                      ? "bg-accent text-accent-foreground shadow-lg"
                      : "bg-surface border border-border text-text-muted group-hover:text-accent"
                  }`}
                >
                  <Icon size={22} strokeWidth={isExpanded ? 2.25 : 2} />
                </motion.div>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="min-w-0 pt-0.5"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-accent">
                      Step {phase.step}
                    </span>
                    <h3 className="text-lg md:text-xl font-bold font-heading leading-tight mt-0.5">
                      {phase.title}
                    </h3>
                    {phase.duration && (
                      <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-text-light/90">
                        <Clock size={10} aria-hidden />
                        {phase.duration}
                      </span>
                    )}
                  </motion.div>
                )}
              </motion.div>

              {/* Collapsed — vertical title */}
              {!isExpanded && (
                <motion.div className="mt-auto flex items-center justify-between gap-2 pb-1 lg:flex-col lg:items-center lg:gap-3 lg:pb-2">
                  <span className="text-[10px] font-bold text-accent font-heading">
                    {phase.step}
                  </span>
                  <h3 className="text-sm font-semibold text-text-muted leading-snug lg:text-center lg:[writing-mode:vertical-rl] lg:[text-orientation:mixed] lg:max-w-18">
                    {phase.title}
                  </h3>
                </motion.div>
              )}

              {/* Expanded content */}
              <AnimatePresence mode="wait">
                {isExpanded && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-auto"
                  >
                    <p className="text-text-light/85 font-body leading-relaxed mb-6 max-w-md text-sm md:text-base">
                      {phase.description}
                    </p>

                    {phase.deliverables?.length > 0 && (
                      <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.12 }}
                      >
                        <h4 className="text-[11px] font-bold text-text-light uppercase tracking-widest">
                          Key deliverables
                        </h4>
                        <ul className="space-y-2">
                          {phase.deliverables.map((item, i) => (
                            <motion.li
                              key={item}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.15 + i * 0.05 }}
                              className="flex items-center gap-2 text-sm text-text-light/75"
                            >
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20">
                                <ChevronRight
                                  size={12}
                                  className="text-accent"
                                  aria-hidden
                                />
                              </span>
                              {item}
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
