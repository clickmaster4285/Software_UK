"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

export function CeoVision() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  return (
    <section ref={containerRef} className="relative mx-auto max-w-[96vw] lg:max-w-[90vw] overflow-hidden px-4 py-20">
      {/* Decorative Background Waves */}
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <svg className="h-full w-full opacity-[0.1]" viewBox="0 0 1440 800" fill="none" preserveAspectRatio="none">
          <motion.path
            d="M-100 300 C 300 500 500 100 800 300 C 1100 500 1300 100 1600 300"
            stroke="#D8B4FE"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 0.4 } : {}}
            transition={{ duration: 3.5, ease: "easeInOut", delay: 0.1 }}
          />
          <motion.path
            d="M-100 400 C 200 100 400 700 720 400 C 1040 100 1240 700 1540 400"
            stroke="#A855F7"
            strokeWidth="3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
          <motion.path
            d="M-100 500 C 200 200 400 800 720 500 C 1040 200 1240 800 1540 500"
            stroke="#C084FC"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 0.6 } : {}}
            transition={{ duration: 3, ease: "easeInOut", delay: 0.3 }}
          />
          <motion.path
            d="M-100 600 C 100 300 600 900 800 600 C 1000 300 1400 900 1600 600"
            stroke="#7E22CE"
            strokeWidth="4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 0.3 } : {}}
            transition={{ duration: 4, ease: "easeInOut", delay: 0.5 }}
          />
        </svg>
      </div>
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={staggerContainer}
        className="flex flex-col items-center"
      >
        {/* Header Section */}
        <motion.div variants={fadeInUp} className="space-y-6 text-center mb-16 md:mb-24">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            CEO <span className="text-accent">Vision</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base md:text-lg text-slate-600 leading-relaxed">
            To build scalable, intelligent custom software development solutions that empower businesses to grow, automate, and transform in a digital-first world.
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          variants={fadeInUp}
          className="relative w-full max-w-6xl overflow-hidden border border-border/50 rounded-3xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
        >
          <div className="flex flex-col md:flex-row min-h-125">
            {/* Left Image Section */}
            <div className="relative h-72 sm:h-96 md:h-auto md:w-1/2 overflow-hidden">
              <motion.div
                initial={{ scale: 1.15 }}
                animate={isInView ? { scale: 1 } : { scale: 1.15 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full w-full"
              >
                <Image
                  src="/landing/sub-services/ceo.jpeg"
                  alt="CEO Vision"
                  fill
                  className="object-cover object-center"
                  draggable={false}
                  priority
                />
              </motion.div>
              {/* Overlays */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent to-black/10 hidden md:block" />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent md:hidden" />
            </div>

            {/* Right Text Content Section */}
            <div className="flex flex-1 flex-col justify-center gap-8 
                           px-6 py-10 sm:px-10 sm:py-12 
                           md:px-14 md:py-16">

              <motion.div variants={fadeInUp} className="space-y-6">
                <span className="text-7xl leading-none text-accent/20 font-serif select-none block -mb-8">
                  &ldquo;
                </span>
                <blockquote className="text-text-primary text-lg sm:text-xl md:text-2xl font-medium leading-relaxed italic">
                  We are not building software. We are architecting the infrastructure
                  of tomorrow—systems that think, adapt, and grow alongside the
                  businesses they power.
                </blockquote>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex items-center gap-5 border-l-2 border-accent/20 pl-6">
                <div className="h-14 w-14 rounded-2xl bg-accent flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-xl shadow-accent/20">
                  AK
                </div>
                <div>
                  <p className="font-bold text-xl text-text-primary">Amjad Khan</p>
                  <p className="text-xs text-text-muted uppercase tracking-[0.2em] font-bold">Chief Executive Officer</p>
                </div>
              </motion.div>

              {/* Stats row */}
              <motion.div variants={fadeInUp} className="mt-4 grid grid-cols-3 gap-8 pt-8 border-t border-border/60">
                {[
                  { value: "12+", label: "Years Exp" },
                  { value: "300+", label: "Success" },
                  { value: "98%", label: "Retention" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl md:text-3xl font-bold text-accent">{stat.value}</p>
                    <p className="text-[10px] uppercase tracking-widest text-text-muted mt-1 font-bold">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
