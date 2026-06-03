// /src/components/landingPage/servicesPage/PricingSection.tsx
"use client";
import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PricingCard } from "@/components/landing/sub-services/PricingCard";

const parseInvestment = (value) => {
  if (!value) return null;

  const isCustom = value.toLowerCase().includes("custom");

  // extract numbers safely (handles commas + ranges + /mo)
  const numbers = value
    .replace(/,/g, "")
    .match(/\d+/g)
    ?.map(Number);

  if (!numbers || numbers.length === 0) {
    return isCustom
      ? { min: 0, max: 0, isCustom: true }
      : null;
  }

  if (numbers.length >= 2) {
    return {
      min: numbers[0],
      max: numbers[1],
      isCustom,
    };
  }

  return {
    min: numbers[0],
    max: numbers[0],
    isCustom,
  };
};

const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export function PricingSection({ serviceName, pricingTiers }) {
  const CHUNK_SIZE = 6;
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const blob1Y = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const blob2Y = useTransform(scrollYProgress, [0, 1], [80, -80]);

  const pricingChunks = chunkArray(pricingTiers, CHUNK_SIZE);
  const [activePage, setActivePage] = useState(0);

  const activeTiers = pricingChunks[activePage] || [];

  if (!pricingTiers || pricingTiers.length === 0) return null;

  const pricingCardsData = activeTiers
    .map((tier) => {
      const parsed = parseInvestment(tier.investment);

      // ❌ skip invalid tiers completely
      if (!parsed) return null;

      const { min, max, isCustom } = parsed;

      return {
        title: tier.type,

        description: `Perfect for businesses that need ${tier.type.toLowerCase()} solutions`,

        price: isCustom ? 0 : min,

        originalPrice: isCustom
          ? undefined
          : max > min
            ? max
            : Math.round(min * 1.5),

        features: [
          {
            title: "Package Includes",
            items: [
              `Timeline: ${tier.timeline}`,
              `Best For: ${tier.bestFor}`,
              `Budget Range: ${isCustom
                ? "Custom"
                : `${min.toLocaleString()} - ${max.toLocaleString()} AUD`
              }`,
              "Dedicated Project Manager",
              "Quality Assurance Testing",
              "Documentation & Training",
            ],
          },
        ],

        buttonText: isCustom ? "Contact Us" : "Get Started",

        onButtonClick: () => { },
      };
    })
    .filter(Boolean); // remove nulls safely

  return (
    <motion.section
      id="pricing"
      ref={sectionRef}
      className="relative mx-auto max-w-[96vw] lg:max-w-[90vw] overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <motion.div
          style={{ y: blob1Y }}
          className="absolute top-0 right-0 h-96 w-96 rounded-full bg-accent/5 blur-[120px]"
        />
        <motion.div
          style={{ y: blob2Y }}
          className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-primary/5 blur-[120px]"
        />
      </div>

      {/* ================= HEADER ================= */}
      <div className="mx-auto max-w-3xl text-center ">

        <div className="inline-flex items-center gap-2 mb-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
            Pricing
          </p>
        </div>

        <motion.h2
          className="mt-5 font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl"
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-accent">{serviceName}</span> Development Pricing
        </motion.h2>

        <motion.p
          className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Transparent pricing tailored to your business needs
        </motion.p>
      </div>

      {/* ================= CARDS ================= */}
      <div className="mt-6 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
        {pricingCardsData.map((cardData, index) => (
          <PricingCard
            key={index}
            title={cardData?.title ?? ""}
            description={cardData?.description ?? ""}
            price={cardData?.price ?? 0}
            originalPrice={cardData?.originalPrice}
            features={cardData?.features ?? []}
            buttonText={cardData?.buttonText}
            onButtonClick={cardData?.onButtonClick}
          />
        ))}
      </div>

      {/* ================= PAGINATION ================= */}
      {pricingChunks.length > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {pricingChunks.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActivePage(idx)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${activePage === idx
                ? "bg-accent text-white border-accent shadow-lg shadow-accent/20"
                : "bg-white text-slate-600 hover:bg-slate-50 border-border"
                }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}



      {/* ================= TRUST ================= */}
      <motion.div
        className="mt-12 sm:mt-16 flex flex-col items-center gap-5 sm:gap-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-500 px-2">
          {[
            "Transparent Pricing",
            "No Hidden Costs",
            "Flexible Engagement",
            "30-Day Support",
          ].map((text, idx) => (
            <motion.div
              key={idx}
              className="flex items-center gap-1.5 sm:gap-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + idx * 0.1 }}
            >
              <svg
                className="h-3 w-3 sm:h-4 sm:w-4 text-accent"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{text}</span>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400 max-w-md">
          * All prices are estimates and may vary based on requirements.
        </p>
      </motion.div>
    </motion.section>
  );
}