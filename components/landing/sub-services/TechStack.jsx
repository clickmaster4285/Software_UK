"use client";

import Image from "next/image";

function TechCard({ item }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 group cursor-default">
      <div className="relative h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16">
        <Image
          src={item.icon || ""}
          alt={item.name || ""}
          width={64}
          height={64}
          className="h-full w-full object-contain transition-all duration-300 group-hover:scale-110"
        />
      </div>
      <span className="text-center text-[11px] leading-tight text-slate-500 transition-colors duration-300 group-hover:text-slate-800 sm:text-xs">
        {item.name}
      </span>
    </div>
  );
}

/**
 * Renders each technology once (static grid).
 * Previous marquee duplicated icons 4–8× into the HTML and pushed pages over 300–600 KB.
 */
export const TechStack = ({ techStack }) => {
  if (!techStack || !Array.isArray(techStack) || techStack.length === 0) return null;

  const categoryItems = techStack.map((stack) => ({
    category: stack.category,
    items: stack.subcategories?.flatMap((sub) => sub.items) || [],
  }));

  return (
    <section id="tech-stack" className="mx-auto max-w-[96vw] scroll-mt-24 lg:max-w-[90vw]">
      <div className="mb-3 flex items-center gap-3 sm:mb-4">
        <div className="h-8 w-1 rounded-full bg-accent sm:h-10" />
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl md:text-3xl">
          Technology Stack
        </h2>
      </div>

      <p className="mb-6 text-base leading-relaxed text-slate-600 sm:mb-8 sm:text-lg md:mb-10">
        Modern tools we use to build scalable, secure applications.
      </p>

      <div className="space-y-8 sm:space-y-10">
        {categoryItems.map(({ category, items }) => {
          if (!items.length) return null;
          return (
            <div key={category}>
              <p className="mb-3 pl-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400 sm:mb-5 sm:text-xs">
                {category}
              </p>
              <div className="grid grid-cols-3 gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-4 sm:gap-6 sm:p-6 md:grid-cols-6 lg:grid-cols-8">
                {items.map((item, i) => (
                  <TechCard key={`${category}-${item.name || i}`} item={item} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="my-12 flex items-center gap-4 sm:my-14 md:my-16">
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-slate-200 to-transparent" />
      </div>
    </section>
  );
};
