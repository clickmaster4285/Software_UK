"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function ExpandOnHover({ images, phases, defaultExpandedIndex = 0 }) {
  const [expandedIndex, setExpandedIndex] = useState(defaultExpandedIndex);

  return (
    <div className="flex flex-col lg:flex-row h-full w-full gap-4 min-h-125">
      {phases.map((phase, index) => {
        const isExpanded = expandedIndex === index;
        const Icon = phase.icon;

        return (
          <div
            key={index}
            onMouseEnter={() => setExpandedIndex(index)}
            className={`relative flex flex-col transition-all duration-500 ease-in-out cursor-pointer overflow-hidden rounded-2xl border ${
              isExpanded 
                ? 'flex-4 bg-slate-900 border-slate-800' 
                : 'flex-1 bg-white border-slate-200'
            }`}
          >
            {/* Background Image with Overlay */}
            {isExpanded && images[index] && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-0"
              >
                <Image 
                  src={images[index]} 
                  alt={phase.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/80 to-transparent" />
              </motion.div>
            )}

            <div className="relative z-10 p-8 h-full flex flex-col">
              <div className={`flex items-center gap-4 mb-6 ${isExpanded ? 'text-white' : 'text-slate-900'}`}>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  isExpanded ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  <Icon size={24} />
                </div>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">Step {phase.step}</span>
                    <h3 className="text-xl font-bold font-heading">{phase.title}</h3>
                  </motion.div>
                )}
              </div>

              {!isExpanded && (
                <div className="mt-auto -rotate-90 origin-left translate-x-6 whitespace-nowrap">
                   <h3 className="text-lg font-bold text-slate-400">{phase.title}</h3>
                </div>
              )}

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-4"
                  >
                    <p className="text-slate-300 font-body leading-relaxed mb-8 max-w-md">
                      {phase.description}
                    </p>

                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">Key Deliverables:</h4>
                      <ul className="space-y-2">
                        {phase.deliverables?.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-slate-400">
                            <ChevronRight size={14} className="text-primary" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}
