"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

const cards = [
  { title: "100+", subtitle: "Projects Delivered" },
  { title: "Agile", subtitle: "Development" },
  { title: "On-time", subtitle: "Delivery" },
  { title: "24/7", subtitle: "Support" },
  { title: "50+", subtitle: "Happy Clients" },
  { title: "10x", subtitle: "Faster Shipping" },
  { title: "ISO", subtitle: "Certified Team" },
];

export function ProjectCTAHero() {
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
    <section className="mx-auto bg-white">
      <div
        className="relative overflow-hidden  bg-primary text-primary-foreground"
        style={{
          clipPath:
            "polygon(0 8%, 100% 0, 100% 92%, 0 100%)",
        }}
      >
        <div className="grid gap-10 px-8 lg:px-24 py-24 md:grid-cols-[1.4fr_1fr] md:px-16 md:py-32">
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-background px-4 py-1.5 text-sm font-medium text-foreground shadow-sm">
             
              Build Your Project
            </span>
            <h2 className="mt-6 text-4xl font-bold leading-tight md:text-5xl">
              Ready to Start Your Project?
              <br />
              Let&apos;s Build Something Amazing
              <br />
              <span className="uppercase">Together</span>
            </h2>
            <p className="mt-5 max-w-xl text-base/relaxed opacity-90">
              Whether you need a custom web app, mobile solution, or enterprise
              software, our team is ready to bring your vision to life.
            </p>
            <button className="mt-8 inline-flex w-fit items-center gap-2 rounded-md border border-primary-foreground/70 bg-transparent px-6 py-3 text-sm font-medium transition hover:bg-primary-foreground hover:text-primary">
              Get In Touch
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

         <div
  className="relative h-105 w-96 overflow-hidden"   // w-96 = 384px, adjust
  onMouseEnter={() => setPaused(true)}
  onMouseLeave={() => setPaused(false)}
  style={{
    maskImage: "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
    WebkitMaskImage: "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
  }}
>
  <div ref={trackRef} className="flex flex-col gap-5 will-change-transform">
    {loop.map((c, i) => (
      <div key={i} className="rounded-2xl border border-primary-foreground/40 bg-primary-foreground/5 px-6 py-7 text-center backdrop-blur-sm transition hover:bg-primary-foreground/15">
        <div className="text-2xl font-bold">{c.title}</div>
        <div className="mt-1 text-sm opacity-90">{c.subtitle}</div>
      </div>
    ))}
  </div>
</div>
        </div>
      </div>
    </section>
  );
}