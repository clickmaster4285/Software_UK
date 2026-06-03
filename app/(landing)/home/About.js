"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function About() {
   return (
      <section className="py-24 bg-surface overflow-hidden">
         <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
               <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
               >
                  <span className="section-label mb-6">Our Philosophy</span>
                  <h2 className="font-heading font-bold text-3xl md:text-5xl text-primary mb-6 leading-tight">
                     About ClickMasters
                  </h2>
                  <h3 className="font-heading font-semibold text-xl md:text-2xl text-accent mb-6">
                     We Do not Just Build Software - We Build Revenue Systems
                  </h3>
                  <div className="space-y-4 text-text-body font-body text-lg leading-relaxed">
                     <p>
                        A results-driven software house building custom web apps, mobile apps, and enterprise software that powers real business growth.
                     </p>
                     <p>
                        Our team of experienced software developers works as a seamless extension of your business - translating complex requirements into reliable, scalable digital products that perform under real-world conditions.
                     </p>
                     <p>
                        As a full-service software house, we handle everything from discovery and UI/UX design to backend development, QA testing, cloud deployment, and long-term maintenance.
                     </p>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-10">
                     <Link
                        href="/contact"
                        className="px-8 py-4 bg-accent text-white font-body font-bold rounded-lg hover:bg-accent-hover transition-all transform hover:scale-105 shadow-xl shadow-accent/20"
                     >
                        Start Your Project
                     </Link>
                     <Link
                        href="/case-studies"
                        className="px-8 py-4 border-2 border-primary text-primary font-body font-bold rounded-lg hover:bg-primary hover:text-white transition-all transform hover:scale-105"
                     >
                        View Our Work
                     </Link>
                  </div>
               </motion.div>

               <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="relative flex justify-center"
               >
                  {/* Decorative background circle */}
                  <div className="absolute inset-0 bg-accent/10 blur-3xl rounded-full transform scale-110" />

                  <motion.img
                     animate={{ y: [0, -15, 0] }}
                     transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                     }}
                     src="/landing/3d-illustration-man-flying.webp"
                     alt="Business Growth Illustration"
                     className="relative z-10 w-full max-w-xl h-auto drop-shadow-2xl"
                  />
               </motion.div>
            </div>
         </div>
      </section>
   );
}

