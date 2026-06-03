"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles, Zap, Code, Cpu } from "lucide-react";

export default function MidCTA() {
   const containerRef = useRef(null);
   const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ["start end", "center center"],
   });

   // Scroll-linked transforms: Zoom from 1.3 to 1.0 as it enters
   const scale = useTransform(scrollYProgress, [0, 1], [1.3, 1]);
   const opacity = useTransform(scrollYProgress, [0, 1], [0.6, 1]);
   const y = useTransform(scrollYProgress, [0, 1], [100, 0]);

   return (
      <section ref={containerRef} className="py-12 relative bg-white overflow-hidden">
         <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto px-6 relative z-10">
            <motion.div
               style={{ scale, opacity, y }}
               className="relative rounded-[4rem] bg-primary p-12 md:p-24 text-center overflow-hidden shadow-2xl shadow-primary/30"
            >
               {/* Background Decorative Glows */}
               <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
               <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none" />

               {/* Floating Elements (Dark Mode Optimized) */}
               <motion.div
                  animate={{ y: [0, -20, 0], rotate: [0, 15, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-16 left-16 w-16 h-16 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center justify-center text-accent hidden lg:flex"
               >
                  <Code className="w-8 h-8" />
               </motion.div>

               <motion.div
                  animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-16 right-16 w-20 h-20 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 flex items-center justify-center text-white/40 hidden lg:flex"
               >
                  <Cpu className="w-10 h-10" />
               </motion.div>

               <div className="relative z-10">
                  <motion.div
                     initial={{ opacity: 0, scale: 0.9 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true }}
                     className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/10 text-accent-light text-sm font-black uppercase tracking-[0.2em] mb-10"
                  >
                     <Sparkles className="w-4 h-4" /> Engineering Excellence
                  </motion.div>

                  <h2 className="font-heading font-bold text-4xl md:text-7xl text-white mb-8 tracking-tighter leading-[1.05]">
                     Building the Future of <br />
                     <span className="text-accent italic font-serif">Digital Innovation.</span>
                  </h2>

                  <p className="text-white/60 font-body text-lg md:text-xl mb-14 max-w-2xl mx-auto leading-relaxed">
                     Don&apos;t just launch software. Deploy a competitive advantage.
                     Our high-performance systems are built to scale with your ambition.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                     <Link
                        href="/contact"
                        className="group relative px-10 py-6 bg-accent text-white font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(var(--accent),0.4)] active:scale-95"
                     >
                        <span className="relative z-10 flex items-center gap-3 text-lg">
                           Start Your Project <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                     </Link>
                     <Link
                        href="/projects"
                        className="px-10 py-6 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold rounded-2xl transition-all backdrop-blur-sm"
                     >
                        View Portfolio
                     </Link>
                  </div>
               </div>

               {/* Subtle texture overlay */}
               <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            </motion.div>
         </div>
      </section>
   );
}
