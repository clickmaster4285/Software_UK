"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight } from "lucide-react";

export const EngineeringBaseline = ({ serviceName, checklist }) => {
  if (!checklist || checklist.length === 0) return null;

  return (
    <section id="checklist" className="scroll-mt-16 sm:scroll-mt-24 pt-8 sm:pt-12 md:pt-16 px-4 sm:px-0">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10">
        <div className="flex items-start gap-3">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
         className="h-8 sm:h-10 md:h-12 w-1 rounded-full bg-primary shrink-0"
          />
          <div>
            <motion.h2 
              className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="font-black">{serviceName}</span>{" "}
              <span className="whitespace-normal sm:whitespace-nowrap">Engineering Baseline</span>
            </motion.h2>
            <motion.p
              className="text-sm sm:text-base text-slate-500 mt-1"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Our engineering standards and best practices
            </motion.p>
          </div>
        </div>
        
        <motion.div
         className="flex items-center gap-2 text-xs sm:text-sm text-primary ml-4 sm:ml-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>All {checklist.length} standards verified</span>
        </motion.div>
      </div>

      {/* Mobile: 1 column, Tablet: 2-3 columns, Desktop: 5 columns */}
     <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4 w-full">
        {checklist.map((item, i) => (
          <motion.div
            key={i}
            className="group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <div className="bg-white rounded-xl overflow-hidden border border-slate-200 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
              {/* Top accent bar */}
            <div className="h-1 bg-gradient-to-r from-primary to-primary w-0 group-hover:w-full transition-all duration-500" />
              
              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="text-2xl sm:text-3xl font-bold text-slate-200 group-hover:text-orange-200 transition-colors duration-300">
                    {(i + 1).toString().padStart(2, '0')}
                  </div>
                  <Badge className="bg-transparent border border-slate-200 text-slate-500 group-hover:bg-orange-50 group-hover:border-orange-200 group-hover:text-primary transition-all duration-300 text-xs sm:text-xs">
                    {item.standard}
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-slate-900 text-sm sm:text-base mb-1 sm:mb-2 line-clamp-2">
                  {item.item}
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-500">
                  Industry-standard compliance
                </p>
                
                {/* Slide up icon on hover - visible on desktop only */}
                <div className="mt-3 sm:mt-4 flex justify-end overflow-hidden">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-primary hidden sm:block"
                  >
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </motion.div>
                  {/* Always visible arrow on mobile */}
                  <ArrowRight className="w-3 h-3 text-primary sm:hidden" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Divider */}
      <div className="my-8 sm:my-12 md:my-16 flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>
    </section>
  );
};


