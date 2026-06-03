"use client";

import Image from "next/image";

function TechCard({ item }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 flex-shrink-0 w-20 sm:w-24 md:w-28 group cursor-default">
      <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
        <Image
          src={item.icon || ""}
          alt={item.name || ""}
          fill
          className="object-contain transition-all duration-300 group-hover:scale-110"
        />
      </div>
      <span className="text-[11px] sm:text-xs text-slate-500 group-hover:text-slate-800 transition-colors duration-300 text-center leading-tight">
        {item.name}
      </span>
    </div>
  );
}

export const TechStack = ({ techStack }) => {
  if (!techStack || !Array.isArray(techStack) || techStack.length === 0) return null;

  const categoryItems = techStack.map((stack) => ({
    category: stack.category,
    items: stack.subcategories?.flatMap((sub) => sub.items) || [],
  }));

  return (
    <>
      <style>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        /* Same speed (60s) for all devices */
        .marquee-left, 
        .marquee-right { 
          animation-duration: 60s; 
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }
        .marquee-left { animation-name: marquee-left; }
        .marquee-right { animation-name: marquee-right; }
        .marquee-left:hover,
        .marquee-right:hover { animation-play-state: paused; }
        body { overflow-x: hidden; }
      `}</style>

      <section id="tech-stack" className="scroll-mt-24 mx-auto max-w-[96vw] lg:max-w-[90vw]">
        <div className="flex items-center gap-3 mb-3 sm:mb-4">
          <div className="h-8 sm:h-10 w-1 rounded-full bg-primary" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900">
            Technology Stack
          </h2>
        </div>

        <p className="mb-6 sm:mb-8 md:mb-10 text-base sm:text-lg text-slate-600 leading-relaxed">
          Modern tools we use to build scalable, secure applications.
        </p>

        <div className="space-y-8 sm:space-y-10">
          {categoryItems.map(({ category, items }, rowIndex) => {
            const repeated = items.length > 0 ? Array.from(
              { length: Math.ceil(20 / items.length) },
              () => items
            ).flat() : [];

            const goLeft = rowIndex % 2 === 0;

            return (
              <div key={category}>
                <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 sm:mb-5 pl-1">
                  {category}
                </p>

                <div className="relative overflow-hidden">
                  {/* Gradient masks - smaller on mobile */}
                  <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-20 z-10 bg-gradient-to-r from-white to-transparent" />
                  <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-20 z-10 bg-gradient-to-l from-white to-transparent" />

                  <div className={`flex gap-4 sm:gap-6 md:gap-8 w-max ${goLeft ? "marquee-left" : "marquee-right"}`}>
                    {[...repeated, ...repeated].map((item, i) => (
                      <TechCard key={`${category}-${i}`} item={item} />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Divider - responsive spacing */}
        <div className="my-12 sm:my-14 md:my-16 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>
      </section>
    </>
  );
};