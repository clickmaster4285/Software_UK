"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const EASE = [0.22, 1, 0.36, 1];

const FALLBACK_PLANS = [
  {
    name: "Discovery",
    description: "Understand scope, stack, and ROI before you commit",
    price: "Free",
    period: "strategy session",
    features: [
      "60-minute consultation",
      "Technical feasibility review",
      "Ballpark timeline & budget",
      "No obligation proposal",
    ],
    cta: "Book a Call",
    popular: false,
  },
  {
    name: "Project Engagement",
    description: "Fixed-scope delivery with milestone-based billing",
    price: "Custom",
    period: "scoped quote",
    features: [
      "Dedicated project team",
      "2-week sprint demos",
      "Source code ownership",
      "QA & security included",
    ],
    cta: "Get a Quote",
    popular: true,
  },
  {
    name: "Dedicated Partnership",
    description: "Long-term engineering capacity aligned to your roadmap",
    price: "Monthly",
    period: "retainer",
    features: [
      "Embedded engineers & PM",
      "Flexible scale up/down",
      "24/7 critical support",
      "SLA-backed delivery",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

function PricingCard({ plan, index }) {
  const isPopular = plan.popular;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: EASE }}
      className={`relative flex h-full flex-col rounded-2xl border bg-white p-6 md:p-8 transition-shadow duration-300 ${
        isPopular
          ? "border-accent/40 shadow-[0_16px_48px_color-mix(in_oklch,var(--accent)_18%,transparent)] ring-1 ring-accent/20"
          : "border-border shadow-[0_2px_16px_rgba(0,0,0,0.06)] hover:border-accent/25 hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)]"
      }`}
    >
      {isPopular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 border-none bg-accent px-4 py-1 text-white">
          Recommended
        </Badge>
      )}

      <header className="text-center pb-6 border-b border-border">
        <h3 className="font-heading text-xl font-semibold text-text-primary">
          {plan.name}
        </h3>
        <p className="mt-2 text-sm text-text-body font-body leading-relaxed">
          {plan.description}
        </p>
        <motion.div
          className="mt-6"
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 + index * 0.05, ease: EASE }}
        >
          <span className="font-heading text-4xl font-bold text-text-primary">
            {plan.price}
          </span>
          {plan.period && (
            <span className="ml-1.5 text-sm text-text-muted font-body">
              {plan.period}
            </span>
          )}
        </motion.div>
      </header>

      <ul className="flex-1 space-y-3.5 py-6">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <span className="icon-circle h-5 w-5 shrink-0 mt-0.5 [&_svg]:h-3 [&_svg]:w-3">
              <Check aria-hidden />
            </span>
            <span className="text-sm text-text-body font-body leading-relaxed">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <Button
        asChild
        className={`h-12 w-full rounded-xl font-body text-sm font-semibold ${
          isPopular
            ? "bg-accent text-white hover:bg-accent-hover"
            : "bg-white text-text-primary border border-border hover:bg-surface"
        }`}
        variant={isPopular ? "default" : "outline"}
      >
        <Link href="/contact">
          {plan.cta || "Get Started"}
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
        </Link>
      </Button>
    </motion.article>
  );
}

export function PricingSection({
  plans: customPlans,
  title,
  subtitle,
}) {
  const rawPlans =
    customPlans?.length > 0
      ? customPlans.map((plan, index) => ({
          ...plan,
          popular: plan.popular ?? index === 1,
          cta: plan.cta ?? (index === 2 ? "Contact Sales" : "Get a Quote"),
        }))
      : FALLBACK_PLANS;

  const displayPlans = rawPlans;

  return (
    <section
      id="pricing"
      className="relative overflow-hidden py-20 md:py-28 font-sans bg-surface"
      aria-labelledby="pricing-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, color-mix(in oklch, var(--accent) 12%, transparent), transparent 70%)",
        }}
      />

      <motion.div
        className="container relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.header
          className="mx-auto max-w-3xl text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <motion.div className="inline-flex items-center gap-2 mb-4">
            <span className="h-px w-8 rounded-full bg-accent" aria-hidden />
            <span className="section-label inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden />
              Investment &amp; Engagement
            </span>
            <span className="h-px w-8 rounded-full bg-accent" aria-hidden />
          </motion.div>

          <h2
            id="pricing-heading"
            className="font-heading text-3xl font-bold tracking-tight text-text-primary sm:text-4xl text-balance"
          >
            {title || "Transparent project investment"}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-text-body font-body leading-relaxed text-pretty">
            {subtitle ||
              "Clear tiers for every stage — from discovery to enterprise delivery. Every engagement starts with a free strategy call."}
          </p>
        </motion.header>

        <motion.div
          className="grid gap-6 md:grid-cols-3 md:gap-8 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {displayPlans.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} index={index} />
          ))}
        </motion.div>

        <motion.p
          className="mt-10 text-center text-sm text-text-muted font-body max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, ease: EASE }}
        >
          Final quotes depend on scope, integrations, and timeline. All plans include a
          free discovery call and written proposal — no hidden fees.
        </motion.p>
      </motion.div>
    </section>
  );
}
