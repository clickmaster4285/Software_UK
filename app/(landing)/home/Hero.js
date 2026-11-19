"use client";

import Link from "next/link";
import Image from "next/image";  

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
               preload="metadata"
               className="absolute inset-0 w-full h-full object-cover"
            >
               {/* <source src="/vedios/bg-vedio1.mp4" type="video/mp4" /> */}
               <source src="/vedios/bg-video.webm" type="video/webm" />
               <source src="/vedios/bg-video-final.mp4" type="video/mp4" />
            </video>
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-black/60 z-10" />
         </div>

         <div className="relative z-20 max-w-[96vw] lg:max-w-[90vw] mx-auto px-6 py-24 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-10 items-center">
               <div className="text-left hero-fade-in" >
                  <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-6xl text-white mb-6 leading-tight">
                     Software Development Company UK -<span className="text-accent">We Build. You Grow</span>
                  </h1>
                  <p className="text-gray-200 font-body text-lg md:text-xl max-w-3xl mb-2">
                     Clickmasters is a software development company UK businesses can rely on to turn ideas, requirements and growth opportunities into practical digital products. We deliver software development services across custom software, websites, applications, SaaS platforms, enterprise systems and AI-powered solutions, all built around real users, business needs and long-term digital growth.
                  </p>
                  <p className="text-gray-200 font-body text-lg md:text-xl mb-10 max-w-3xl">
                     Whether you have a clear product idea, an existing system that needs improving or an opportunity to work smarter with technology, we bring strategy, design and development together to turn your requirements into working software.
                  </p>
                  <div className="flex flex-wrap gap-4 mb-10">
                     <Link
                        href="/contact"
                        className="px-8 py-4 bg-accent text-white font-body font-bold text-lg rounded-lg hover:bg-accent-hover transition-all transform hover:scale-105 shadow-xl">
                        Start Your Software Project
                     </Link>
                     <Link
                        href="/case-studies"
                        className="px-8 py-4 border-2 border-white text-white font-body font-bold text-lg rounded-lg hover:bg-white hover:text-primary transition-all transform hover:scale-105 shadow-xl"
                     >
                        View Our Work
                     </Link>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="flex -space-x-3" aria-hidden="true">
                        {["CM", "UK", "FS", "AI"].map((initials, i) => (
                           <div
                              key={initials}
                              className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-[11px] font-heading font-bold text-white"
                              style={{
                                 background:
                                    ["oklch(0.45 0.12 250)", "oklch(0.5 0.14 30)", "oklch(0.42 0.1 160)", "oklch(0.48 0.13 300)"][i],
                                 zIndex: 4 - i,
                              }}
                           >
                              {initials}
                           </div>
                        ))}
                     </div>
                     <p className="text-gray-300 font-body text-sm">
                        Trusted by <span className="text-white font-bold">50+</span> UK &amp; international businesses
                     </p>
                  </div>
               </div>

               <div
                  className="hidden lg:flex justify-center relative hero-image-enter"
               >
                  {/* Decorative background glow */}
                  <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />

                  <div
                     className="relative z-10 w-full max-w-lg h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] hero-float"
                  >
                     <Image
                        src="/landing/hero-home-image-1.webp"
                        alt="Software Development Specialist"
                        width={600}
                        height={800}
                        priority
                        className="w-full h-auto"
                     />
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}

