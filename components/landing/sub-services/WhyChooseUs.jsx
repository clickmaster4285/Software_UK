"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const WhyChooseUs = ({ slug, differentiators }) => {
  if (!differentiators || differentiators.length === 0) return null;

  const isEnterprise = slug.includes("enterprise");
  const isSaaS = slug.includes("saas");
  const isMVP = slug.includes("mvp");

  const getTitleText = () => {
    if (isEnterprise) return "Enterprise Organizations";
    if (isSaaS) return "SaaS Founders";
    if (isMVP) return "Founders";
    return "Companies";
  };

  const getColumnHeaders = () => {
    if (isEnterprise) return ["ClickMasters", "SAP / Oracle", "Generic SaaS"];
    if (isSaaS) return ["In House Team", "ClickMasters"];
    return ["Description"];
  };

  const getHighlightedIndex = () => {
    if (isEnterprise) return 0;
    if (isSaaS) return 1;
    return -1;
  };

  const columnHeaders = getColumnHeaders();
  const highlightedIndex = getHighlightedIndex();

  return (
    <motion.section
      id="why-choose-us"
      className="scroll-mt-24 py-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-10">
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: 40 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="h-10 w-1 rounded-full bg-primary"
        />
        <motion.h2
          className="text-2xl font-semibold text-text-primary sm:text-3xl font-heading"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Why {getTitleText()} Choose ClickMasters
        </motion.h2>
      </div>

      {/* Cards Grid - 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {differentiators.map((diff, idx) => {
    const parts = diff.description.split("|").map((s, index) => s.trim());
    const isMultiCol = parts.length > 1;

    return (
      <motion.div
        key={diff.feature}
        className="group rounded-2xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden flex flex-col h-full border border-border hover:border-primary/20 hover:-translate-y-1"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: idx * 0.07 }}
      >
        {/* Card Header - Enhanced Gradient */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/20" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative px-5 pt-5 pb-4">
            <div className="flex items-start gap-3">
              <motion.span
                className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm text-primary text-sm font-bold shrink-0"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.3 }}
              >
                {idx + 1}
              </motion.span>
              <span className="font-bold text-black text-base leading-snug flex-1">
                {diff.feature}
              </span>
            </div>
          </div>
        </div>

        {/* Card Body - Improved Multi-Column Support */}
        <div className="flex flex-col flex-1">
          {isMultiCol ? (
            <div className="divide-y divide-slate-100">
              {parts.map((part, i) => {
                const isHighlighted = (isSaaS && i === highlightedIndex) || 
                                     (isEnterprise && i === highlightedIndex);
                
                // Determine column label and styling based on index
                const getColumnStyle = () => {
                  if (isEnterprise) {
                    if (i === 0) return { bg: "bg-primary/10" , border: "border-primary/20", text: "text-primary", label: "ClickMasters" };
                    if (i === 1) return { bg: "bg-surface", border: "border-border", text: "text-text-body", label: "SAP / Oracle" };
                    return { bg: "bg-surface", border: "border-border", text: "text-text-body", label: "Generic SaaS" };
                  }
                  if (isSaaS) {
                    if (i === 0) return { bg: "bg-surface", border: "border-border", text: "text-text-body", label: "In House Team" };
                    return { bg: "bg-primary/10" , border: "border-primary/20", text: "text-primary", label: "ClickMasters ✓" };
                  }
                  return { bg: "bg-white", border: "border-border", text: "text-text-body", label: columnHeaders[i] };
                };
                
                const style = getColumnStyle();
                
                return (
                  <motion.div
                    key={i}
                    className={cn(
                      "p-4 transition-all duration-200",
                      style.bg,
                      i !== parts.length - 1 && `border-b ${style.border}`
                    )}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.07 + i * 0.08 }}
                  >
                    {/* Header with icon and label */}
                    <div className="flex items-center gap-2 mb-2">
                      {isHighlighted ? (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-surface-2 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                      )}
                      <span className={cn(
                        "text-xs font-bold uppercase tracking-wider",
                        isHighlighted ? "text-primary" : "text-text-muted"
                      )}>
                        {style.label}
                      </span>
                      
                      {/* Performance badge */}
                      {isHighlighted && (
                        <span className="ml-auto text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                          Best Choice
                        </span>
                      )}
                    </div>
                    
                    {/* Content */}
                    <p className={cn(
                      "text-sm leading-relaxed",
                      style.text
                    )}>
                      {part}
                    </p>
                    
                    {/* Feature tags for enterprise version */}
                    {isEnterprise && i === 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">Enterprise-ready</span>
                        <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">24/7 Support</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="p-5 flex-1">
              <div className="flex items-start gap-2">
                <div className="w-1 h-8 bg-primary rounded-full shrink-0" />
                <p className="text-sm text-text-body leading-relaxed">
                  {diff.description}
                </p>
              </div>
            </div>
          )}
        </div>
        
     
      </motion.div>
    );
  })}
</div>

      {/* Bottom Divider */}
      <motion.div
        className="mt-16 flex flex-col items-center gap-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex items-center gap-4 w-full">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-border" />
          <div className="flex gap-2">
            {[0, 0.2, 0.4].map((delay, i) => (
              <motion.div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full",
                  i === 0 ? "bg-primary" : i === 1 ? "bg-primary" : "bg-primary"
                )}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay }}
              />
            ))}
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-border via-border to-transparent" />
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-sm text-text-muted">
          {[
            { text: "Trusted by 500+ Companies", delay: 0 },
            { text: "4.9/5 Client Rating", delay: 0.1 },
            { text: "15+ Years Experience", delay: 0.2 },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 + item.delay }}
            >
              <svg
                className="w-4 h-4 text-primary"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{item.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
};