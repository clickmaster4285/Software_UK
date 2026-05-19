"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

const cards = [
  { subtitle: "Free Consultation" },
  { subtitle: "Agile Development" },
  { subtitle: "On-Time Delivery" },
  { subtitle: "24/7 Support" },
  { subtitle: "Custom Software Solutions" },
  { subtitle: "Scalable Applications" },
  { subtitle: "Enterprise Security" },
];

export function FinalCTA() {
  const trackRef = useRef(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    let y = 0;
    const step = () => {
      if (!paused) {
        y += 0.5;
        const half = el.scrollHeight / 2;
        if (y >= half) y = 0;
        el.style.transform = `translateY(${-y}px)`;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  const loop = [...cards, ...cards];

  return (
    <section 
      id="final-consultation"
      className="relative bg-accent/80"
      aria-labelledby="cta-heading"
    >
      <div
        className="relative overflow-hidden bg-primary text-white"
        style={{
          clipPath: "polygon(0 7%, 100% 0, 100% 93%, 0 100%)",
        }}
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative z-10 py-24 md:py-32">
          <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr] items-center">
            
            {/* Content Side */}
            <div className="flex flex-col justify-center text-left">
              <span className="section-label mb-6 bg-white/10 text-white border-white/20">
                Get a Free Consultation
              </span>
              
              <h2 id="cta-heading" className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">
                Have a software project in mind?
                <br />
                <span className="text-accent">Let&apos;s Build it Together</span>
              </h2>
              
              <p className="font-body text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-xl">
                Our software development team will discuss your requirements and propose a technical solution 
                tailored to your specific business goals.
              </p>  
              
              <div className="flex flex-wrap gap-4">
                <button className="btn-primary group h-14 px-10 rounded-xl bg-accent text-white hover:bg-accent-hover transition-all duration-300 shadow-xl shadow-accent/20">
                  <span className="flex items-center gap-2">
                    Contact Us
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              </div>
            </div>

            {/* Interactive Ticker Side */}
            <div className="relative hidden md:block">
              <div
                className="relative h-112.5 w-full max-w-sm mx-auto overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                style={{
                  maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
                  WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
                }}
              >
                <div ref={trackRef} className="flex flex-col gap-4 p-4 will-change-transform">
                  {loop.map((c, i) => (
                    <div 
                      key={i} 
                      className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition-all duration-300 hover:bg-white/10 hover:border-accent/30 group"
                    >
                      <div className="font-heading text-base font-semibold text-white/90 group-hover:text-accent transition-colors duration-300">
                        {c.subtitle}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Floating element for depth */}
              <div className="absolute -top-6 -right-6 p-4 rounded-2xl bg-accent shadow-2xl animate-bounce duration-3000">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}