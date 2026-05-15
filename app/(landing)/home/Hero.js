"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { StrategyCallModal } from "@/components/StrategyCallModal";

export default function Hero() {
   return (
      <section className="relative min-h-[95vh] flex items-center overflow-hidden">
         {/* Background Video */}
         <div className="absolute inset-0 z-0">
            <video
               autoPlay
               loop
               muted
               playsInline
               className="absolute inset-0 w-full h-full object-cover"
            >
               <source src="/vedios/bg-vedio1.mp4" type="video/mp4" />
            </video>
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-black/60 z-10" />
         </div>

         <div className="relative z-20 max-w-400 mx-auto px-6 py-24 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
               <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-left"
               >
                  <h1 className="font-heading font-bold text-3xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
                     Software Development Company <span className="italic font-semibold "> whose mission is  <span/> </span><span className="text-accent">We Build. You Grow</span>
                  </h1>
                  <p className="text-gray-200 font-body text-lg md:text-xl mb-10 max-w-3xl">
                     Creating the future of business. We’re a Software development Company delivering bespoke web, mobile, SaaS, and AI-powered systems including AI monitoring solutions powering a global market 
                  </p>
                  <div className="flex flex-wrap gap-4 mb-10">
                     <StrategyCallModal
                        trigger={
                           <button className="px-8 py-4 bg-accent text-white font-body font-bold text-lg rounded-lg hover:bg-accent-hover transition-all transform hover:scale-105 shadow-xl">
                              Get Free Strategy Call
                           </button>
                        }
                     />
                     <Link
                        href="/contact"
                        className="px-8 py-4 border-2 border-white text-white font-body font-bold text-lg rounded-lg hover:bg-white hover:text-primary transition-all transform hover:scale-105 shadow-xl"
                     >
                        Request Proposal
                     </Link>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map((i) => (
                           <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-300 overflow-hidden">
                              <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="client" />
                           </div>
                        ))}
                     </div>
                     <p className="text-gray-300 font-body text-sm">
                        Joined by <span className="text-white font-bold">500+</span> successful businesses
                     </p>
                  </div>
               </motion.div>

               <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="hidden lg:flex justify-center relative"
               >
                  {/* Decorative background glow */}
                  <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />

                  <motion.img
                     animate={{ y: [0, -20, 0] }}
                     transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                     }}
                     src="/landing/hero-home-image-1.webp"
                     alt="Software Development Specialist"
                     className="relative z-10 w-full max-w-lg h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                  />
               </motion.div>
            </div>
         </div>
      </section>
   );
}

