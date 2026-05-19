"use client";

import React from "react";
import { motion } from "framer-motion";
import { Rocket, Check, Sparkles } from "lucide-react";
import { iconMap } from "@/data/main-services";
import { getWhyChooseUsData } from "@/data/whyChooseUsData";

const EASE = [0.22, 1, 0.36, 1];

function resolveIcon(iconKey) {
  return iconMap[iconKey] || Rocket;
}

function resolveBenefits(benefits = []) {
  return benefits.map((benefit) => ({
    ...benefit,
    icon: resolveIcon(benefit.icon),
  }));
}

function StatsStrip({ stats }) {
  return (
    <motion.div
      className="mb-12 md:mb-14 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto rounded-2xl border border-border bg-white px-6 py-8 md:px-10"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {stats.map((stat) => (
        <motion.div key={stat.label} className="text-center">
          <p className="font-heading text-2xl md:text-3xl font-bold text-primary">
            {stat.number}
          </p>
          <p className="mt-1 text-sm text-text-muted font-body">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

function BenefitCard({
  icon: Icon,
  title,
  description,
  features,
  stats,
  statLabel,
  index,
}) {
  const isFull = Boolean(features?.length);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: EASE }}
      className="group h-full"
    >
      <motion.div
        className="relative flex h-full flex-col rounded-2xl border border-border bg-white p-6 md:p-7 shadow-[0_2px_16px_rgba(0,0,0,0.05)] transition-shadow duration-300 hover:border-accent/35 hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)]"
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      >
        <span className="icon-circle mb-5 shrink-0">
          <Icon className="h-5 w-5" aria-hidden />
        </span>

        <h3 className="font-heading text-lg font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>

        <p className="text-sm text-text-body font-body leading-relaxed flex-1">
          {description}
        </p>

        {isFull && (
          <>
            <ul className="mt-4 flex flex-wrap gap-2">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] font-medium text-text-muted font-body"
                >
                  <Check className="h-3 w-3 text-accent shrink-0" aria-hidden />
                  {feature}
                </li>
              ))}
            </ul>

            {stats && (
              <div className="mt-5 pt-4 border-t border-border">
                <p className="font-heading text-2xl font-bold text-transparent bg-clip-text bg-linear-to-br from-primary to-accent">
                  {stats}
                </p>
                <p className="text-[11px] uppercase tracking-[0.08em] text-text-muted font-body mt-0.5">
                  {statLabel}
                </p>
              </div>
            )}
          </>
        )}
      </motion.div>
    </motion.article>
  );
}

/**
 * Why Choose Us section — data from @/data/whyChooseUsData.js (keyed by slug).
 */
export function WhyChooseUs({ slug, service, countryName }) {
  const data = getWhyChooseUsData(slug, service);

  const displaySubtitle = data.subtitle;
  const stats = data.stats ?? [];
  const benefits = resolveBenefits(data.benefits);

  return (
    <section
      className="relative bg-transparent py-20 overflow-hidden"
      aria-labelledby="why-choose-heading"
    >
      {/* Premium Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated Mesh Gradients */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="absolute inset-0"
        >
          <div className="absolute top-0 left-1/4 w-125 h-125 bg-accent/15 rounded-full blur-[120px] -translate-y-1/2" />
          <div className="absolute bottom-0 right-1/4 w-150 h-150 bg-primary/15 rounded-full blur-[140px] translate-y-1/2" />
          <div className="absolute top-1/4 left-1/4 -translate-x-1/3 -translate-y-1/4 w-3/4 h-32 h-2/3  bg-accent/15" />
          <div className="absolute top-1/2 right-1/4 translate-x-1/3 translate-y-1/4 w-3/4 h-32 h-2/3  bg-accent/15" />
          <div className="absolute top-3/4 right-13 left-1/4 -translate-x-1/3 -translate-y-1/4 w-3/4 h-32 h-2/3  bg-accent/15" />
        </motion.div>
        
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(var(--text-muted) 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />

        {/* Decorative Floating Nodes */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -20, 0],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 5 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i,
              }}
              className="absolute h-1.5 w-1.5 rounded-full bg-accent"
              style={{
                top: `${20 + i * 20}%`,
                left: `${10 + (i % 2) * 80}%`,
              }}
            />
          ))}
        </div>
      </div>

      <motion.div className="container relative z-10">
        <motion.header
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="text-lg font-bold uppercase tracking-wide text-accent">
              Why Choose Us
            </span>
          </div>

          <h2
            id="why-choose-heading"
            className="font-heading text-4xl font-bold tracking-tight text-text-primary leading-tight mb-8"
          >
            Why Choose {" "}
            <span className="text-accent">ClickMasters</span>
          </h2>

          <p className="mt-4 text-lg md:text-xl text-text-body font-body leading-relaxed max-w-2xl mx-auto">
            {displaySubtitle}
          </p>
        </motion.header>

        {stats.length > 0 && <StatsStrip stats={stats} />}

        <motion.div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <BenefitCard
              key={benefit.title}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
              features={benefit.features}
              stats={benefit.stats}
              statLabel={benefit.statLabel}
              index={index}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

export default WhyChooseUs;
