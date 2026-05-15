"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import { useRef } from "react";
import { Check, ArrowRight, Zap, Target, Layers, Globe, MousePointer2 } from "lucide-react";

export default function Pricing() {
   const containerRef = useRef(null);
   const cardRef = useRef(null);
   
   // Flashlight effect logic
   const mouseX = useMotionValue(0);
   const mouseY = useMotionValue(0);
   
   function onMouseMove({ currentTarget, clientX, clientY }) {
      const { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
   }

   const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ["start end", "end start"],
   });

   const y = useTransform(scrollYProgress, [0, 1], [0, -40]);

   const services = [
      { icon: <Zap className="w-5 h-5" />, title: "Quick-Fix Tasks", desc: "Bug fixes & UI tweaks." },
      { icon: <Target className="w-5 h-5" />, title: "MVP Launch", desc: "Idea to market fast." },
      { icon: <Layers className="w-5 h-5" />, title: "Full Systems", desc: "Scalable app ecosystems." },
      { icon: <Globe className="w-5 h-5" />, title: "DevOps", desc: "Global cloud scale." },
   ];

   return (
      <section ref={containerRef} className="py-12 bg-surface/30 relative overflow-hidden">
         {/* Aesthetic background glows */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[160px] pointer-events-none" />

         {/* Decorative Corner Images - Honeycomb Soft Shapes */}
         <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 0.8, x: 0 }}
            animate={{ y: [0, 20, 0] }}
            transition={{ 
               opacity: { duration: 1 },
               y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
            style={{ clipPath: "polygon(5% 5%, 85% 5%, 95% 50%, 85% 95%, 15% 95%, 5% 50%)" }}
            className="absolute top-18 left-24 w-80 h-80 overflow-hidden pointer-events-none hidden xl:block rounded-[3rem]"
         >
            <img 
               src="/landing/pricing_1.avif" 
               alt="" 
               className="w-full h-full object-cover"
            />
         </motion.div>

         <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 0.8, x: 0 }}
            animate={{ y: [0, -20, 0] }}
            transition={{ 
               opacity: { duration: 1 },
               y: { duration: 7, repeat: Infinity, ease: "easeInOut" }
            }}
            style={{ clipPath: "polygon(9% 5%, 85% 5%, 95% 50%, 85% 95%, 9% 95%, 5% 50%)" }}
            className="absolute bottom-32 right-1 w-96 h-96 overflow-hidden pointer-events-none hidden xl:block rounded-[4rem]"
         >
            <img 
               src="/landing/pricing_2.jpg" 
               alt="" 
               className="w-full h-full object-cover"
            />
         </motion.div>

         <div className="max-w-400 mx-auto px-6 relative z-10">
            <div className="text-center mb-24">
               <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mx-auto mb-6 shadow-inner cursor-pointer transition-transform"
               >
                  <MousePointer2 className="w-6 h-6" />
               </motion.div>
               <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="font-heading font-bold text-4xl md:text-6xl text-primary mb-6 tracking-tight"
               >
                  Predictable <span className="text-accent italic font-serif">Value.</span>
               </motion.h2>
               <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-text-muted font-body text-lg max-w-xl mx-auto"
               >
                  High-end engineering simplified into a single, transparent value model.
               </motion.p>
            </div>

            <motion.div 
               style={{ y }}
               className="max-w-5xl mx-auto"
            >
               <motion.div 
                  ref={cardRef}
                  onMouseMove={onMouseMove}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative group p-px rounded-[3.5rem] bg-gradient-to-b from-border/50 via-white to-border/50 shadow-2xl overflow-hidden"
               >
                  {/* Flashlight Overlay */}
                  <div 
                     className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
                     style={{
                        background: `radial-gradient(600px circle at var(--x, 0px) var(--y, 0px), rgba(124, 58, 237, 0.08), transparent 40%)`
                     }}
                  />

                  {/* Subtle inner card with glassmorphism */}
                  <div 
                     onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
                        e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
                     }}
                     className="relative bg-white/90 backdrop-blur-3xl rounded-[3.45rem] p-8 md:p-20 overflow-hidden"
                  >
                     
                     {/* Decorative animated mesh */}
                     <motion.div 
                        animate={{ 
                           scale: [1, 1.2, 1],
                           rotate: [0, 90, 0],
                           opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ duration: 15, repeat: Infinity }}
                        className="absolute -top-1/2 -right-1/2 w-full h-full bg-accent/5 rounded-full blur-[100px] pointer-events-none" 
                     />

                     <div className="grid lg:grid-cols-2 gap-20 items-center">
                        {/* Left Side: The Spectrum */}
                        <div className="relative z-10">
                           <motion.div 
                              whileHover={{ x: 5 }}
                              className="inline-block px-4 py-1.5 rounded-full bg-accent text-white text-[10px] font-black uppercase tracking-[0.3em] mb-10 shadow-lg shadow-accent/20 cursor-default"
                           >
                              The Value Spectrum
                           </motion.div>
                           
                           <h3 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-12 leading-[1.1] tracking-tighter">
                              Everything from <br/>
                              <span className="text-accent underline decoration-accent/20 underline-offset-8">€50 to €1000+</span>
                           </h3>
                           
                           <div className="space-y-10 relative">
                              <div className="absolute left-[15px] top-4 bottom-4 w-px bg-gradient-to-b from-accent/50 via-border to-primary/30" />

                              <motion.div 
                                 whileHover={{ x: 10 }}
                                 className="relative pl-12 group/item cursor-default"
                              >
                                 <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-white border-2 border-accent flex items-center justify-center shadow-md group-hover/item:scale-110 transition-transform">
                                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                 </div>
                                 <div className="text-primary font-bold text-lg mb-1 group-hover/item:text-accent transition-colors">Micro-Engagements</div>
                                 <p className="text-text-muted text-sm leading-relaxed">Task-based sprints for rapid UI tweaks and bug squashing.</p>
                              </motion.div>

                              <motion.div 
                                 whileHover={{ x: 10 }}
                                 className="relative pl-12 group/item cursor-default"
                              >
                                 <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-white border-2 border-primary flex items-center justify-center shadow-md group-hover/item:scale-110 transition-transform">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                 </div>
                                 <div className="text-primary font-bold text-lg mb-1 group-hover/item:text-accent transition-colors">Macro-Solutions</div>
                                 <p className="text-text-muted text-sm leading-relaxed">End-to-end architecture for complex apps and ecosystems.</p>
                              </motion.div>
                           </div>
                        </div>

                        {/* Right Side: Glass List */}
                        <div className="relative z-10">
                           <div className="absolute -inset-4 bg-accent/5 rounded-[2.5rem] blur-2xl" />
                           <div className="relative bg-surface/50 border border-border/50 rounded-[2.5rem] p-8 md:p-12 shadow-inner">
                              <h4 className="text-primary font-heading font-black text-xs uppercase tracking-[0.2em] mb-10 opacity-60">Deliverables Matrix</h4>
                              
                              <div className="grid gap-8 mb-12">
                                 {services.map((service, idx) => (
                                    <motion.div 
                                       key={idx} 
                                       initial={{ opacity: 0, x: 20 }}
                                       whileInView={{ opacity: 1, x: 0 }}
                                       transition={{ delay: 0.4 + idx * 0.1 }}
                                       className="flex gap-5 items-start group/item"
                                    >
                                       <motion.div 
                                          whileHover={{ rotate: 10, scale: 1.1 }}
                                          className="w-12 h-12 rounded-2xl bg-white border border-border shadow-sm flex items-center justify-center text-accent group-hover/item:border-accent group-hover/item:shadow-lg transition-all duration-300"
                                       >
                                          {service.icon}
                                       </motion.div>
                                       <div>
                                          <div className="text-primary font-bold text-sm mb-1 group-hover/item:text-accent transition-colors">{service.title}</div>
                                          <div className="text-text-muted text-xs leading-relaxed">{service.desc}</div>
                                       </div>
                                    </motion.div>
                                 ))}
                              </div>

                              <Link
                                 href="/contact"
                                 className="group/btn relative block w-full py-6 bg-primary text-white font-bold rounded-2xl text-center overflow-hidden transition-all shadow-xl shadow-primary/20 active:scale-95"
                              >
                                 <motion.div 
                                    className="absolute inset-0 bg-accent translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out" 
                                 />
                                 <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                                    Book Strategy Call <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                 </span>
                              </Link>
                           </div>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </motion.div>

            {/* Micro-interaction label */}
            <motion.div 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               className="mt-12 flex justify-center items-center gap-2 text-text-muted text-[10px] font-bold uppercase tracking-widest opacity-40"
            >
               <span className="w-8 h-px bg-border" />
               Hover to explore pricing dynamics
               <span className="w-8 h-px bg-border" />
            </motion.div>
         </div>
      </section>
   );
}
