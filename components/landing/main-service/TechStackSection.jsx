"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { techStackImages, techStackNames } from "@/data/aboutData";

const EASE = [0.22, 1, 0.36, 1];

const CATEGORIES = [
  { key: "frontend", label: "Frontend Development" },
  { key: "backend", label: "Backend Development" },
  { key: "mobile", label: "Mobile Development" },
  { key: "database", label: "Database & Storage" },
  { key: "cloud", label: "Cloud & Infrastructure" },
  { key: "devops", label: "DevOps & Monitoring" },
];

function buildCategories() {
  return CATEGORIES.map(({ key, label }) => ({
    key,
    label,
    items: (techStackNames[key] || [])
      .map((name, idx) => ({
        name,
        icon: techStackImages[key]?.[idx],
      }))
      .filter((item) => item.icon),
  }));
}

function TechIconCell({ name, icon }) {
  return (
    <motion.div
      className="group flex flex-col items-center gap-2 rounded-xl border border-transparent bg-surface/80 p-3 transition-colors duration-300 hover:border-accent/25 hover:bg-white"
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 400, damping: 24 }}
    >
      <motion.div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white p-2 shadow-sm transition-shadow duration-300 group-hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
        <Image
          src={icon}
          alt={name}
          width={32}
          height={32}
          className="h-8 w-8 object-contain"
        />
      </motion.div>
      <span className="text-center text-[11px] font-medium leading-tight text-text-body font-body line-clamp-2">
        {name}
      </span>
    </motion.div>
  );
}

function CategoryCard({ category, items, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: EASE }}
      className="rounded-2xl border border-border bg-white p-5 md:p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)] transition-shadow duration-300 hover:shadow-[0_8px_28px_rgba(0,0,0,0.08)]"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="h-8 w-1 rounded-full bg-accent" aria-hidden />
        <h3 className="font-heading text-base font-semibold text-text-primary md:text-lg">
          {category}
        </h3>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {items.map((item) => (
          <TechIconCell key={item.name} name={item.name} icon={item.icon} />
        ))}
      </div>
    </motion.article>
  );
}

export function TechStackSection() {
  const categories = useMemo(() => buildCategories(), []);
  const [activeTab, setActiveTab] = useState(categories[0]?.key ?? "frontend");

  const activeCategory = categories.find((c) => c.key === activeTab) ?? categories[0];

  return (
    <section
      className="bg-surface py-20 font-sans"
      aria-labelledby="tech-stack-heading"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div
          className="absolute bottom-0 left-0 h-64 w-64 rounded-full blur-3xl opacity-20"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklch, var(--primary) 15%, transparent), transparent 70%)",
          }}
        />
      </motion.div>

      <div className="container relative z-10">
        <motion.header
          className="text-center mb-12 "
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <motion.div className="inline-flex items-center gap-2 mb-4">
            <span className="text-lg font-bold uppercase tracking-[0.2em] text-accent">Technology Stack</span>
          </motion.div>
          <h2
            id="tech-stack-heading"
            className="font-heading text-3xl font-bold tracking-tight text-text-primary sm:text-4xl"
          >
            Modern tools powering{" "}
            <span className="font-bold uppercase tracking-wide text-accent">
              scalable applications
            </span>
          </h2>
          <p className="mt-4 text-base text-text-body font-body leading-relaxed sm:text-lg">
            Proven frameworks and cloud platforms our engineers use to build
            secure, high-performance products.
          </p>
        </motion.header>

        {/* Mobile: category tabs */}
        <div className="lg:hidden mb-6 -mx-1 overflow-x-auto custom-scrollbar">
          <div className="flex gap-2 px-1 pb-1 min-w-min">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveTab(cat.key)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium font-body transition-all duration-300 ${
                  activeTab === cat.key
                    ? "bg-primary text-text-light shadow-sm"
                    : "bg-white border border-border text-text-muted hover:text-text-body"
                }`}
              >
                {cat.label.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile: single active card */}
        <div className="lg:hidden">
          {activeCategory && (
            <CategoryCard
              category={activeCategory.label}
              items={activeCategory.items}
              index={0}
            />
          )}
        </div>

        {/* Desktop: bento grid */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-5 md:gap-6">
          {categories.map((cat, index) => (
            <CategoryCard
              key={cat.key}
              category={cat.label}
              items={cat.items}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}