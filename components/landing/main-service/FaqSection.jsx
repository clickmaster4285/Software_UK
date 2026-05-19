"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Sparkles,
  MessageCircle,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const EASE = [0.22, 1, 0.36, 1];

const DEFAULT_FAQS = [
  {
    question: "How much does custom software development cost?",
    answer:
      "Costs depend on complexity, integrations, and timeline. MVPs often start around $8,000, full applications from $25,000, and enterprise platforms are scoped individually. Every engagement begins with a free discovery call and written estimate.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "MVPs ship in 6–12 weeks. Full web or mobile products usually take 3–6 months. Enterprise programs run 6–18 months with working releases every two weeks via agile sprints.",
  },
  {
    question: "What technologies do you use?",
    answer:
      "We use React, Next.js, Node.js, Python, Flutter, React Native, PostgreSQL, MongoDB, and cloud platforms including AWS, Azure, and GCP — chosen per project requirements.",
  },
  {
    question: "Do you provide post-launch support?",
    answer:
      "Yes. We offer maintenance retainers covering security patches, monitoring, performance tuning, and ongoing feature development with SLA-backed response times.",
  },
];

function FaqItem({ item, index, isOpen, onToggle }) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: EASE }}
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        isOpen
          ? "border-accent/50 bg-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]"
      }`}
    >
      {isOpen && (
        <span
          className="absolute left-0 top-0 bottom-0 w-1 bg-accent"
          aria-hidden
        />
      )}

      <button
        type="button"
        id={`faq-trigger-${index}`}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${index}`}
        onClick={onToggle}
        className="flex w-full items-start gap-4 p-5 md:p-6 text-left"
      >
        <span
          className={`mt-0.5 shrink-0 font-heading text-xs font-bold tracking-[0.2em] transition-colors duration-300 ${
            isOpen ? "text-accent" : "text-white/35"
          }`}
          aria-hidden
        >
          {num}
        </span>

        <span className="flex-1 min-w-0">
          <span
            className={`block font-heading text-base md:text-lg font-semibold leading-snug transition-colors duration-300 ${
              isOpen ? "text-white" : "text-white/90 group-hover:text-white"
            }`}
          >
            {item.question}
          </span>
        </span>

        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
            isOpen
              ? "border-accent/40 bg-accent text-white rotate-180"
              : "border-white/15 bg-white/5 text-white/70 group-hover:border-white/30"
          }`}
        >
          <ChevronDown className="h-4 w-4" aria-hidden />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-panel-${index}`}
            role="region"
            aria-labelledby={`faq-trigger-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/10 px-5 md:px-6 pb-5 md:pb-6 pt-4 ml-10 md:ml-11">
              <p className="text-sm md:text-base leading-relaxed text-white/75 font-body">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FaqSection({ faqs: customFaqs, serviceTitle, subtitle }) {
  const displayFaqs =
    customFaqs?.length > 0 ? customFaqs : DEFAULT_FAQS;
  const [openIndex, setOpenIndex] = useState(0);

  const headline = serviceTitle
    ? `${serviceTitle} — FAQs`
    : "Frequently asked questions";

  return (
    <section
      className="relative overflow-hidden font-sans bg-accent/80"
      aria-labelledby="faq-heading"
    >
      {/* Primary gradient canvas */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(145deg, var(--primary) 0%, var(--primary-mid) 42%, color-mix(in oklch, var(--accent) 35%, var(--accent)) 100%) ",
          clipPath: "polygon(0 0%, 100% 0, 100% 100%, 0 90%)",
        }}
        aria-hidden
      />

      {/* style={{
        clipPath: "polygon(0 7%, 100% 0, 100% 93%, 0 100%)",
      }} */}

      {/* Atmospheric layers */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        aria-hidden
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />
      <div
        className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full opacity-30"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--accent) 50%, transparent), transparent 70%)",
        }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full opacity-20"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle, white, transparent 65%)",
        }}
      />

      <div className="container relative z-10 py-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,30rem)_1fr] lg:items-start">
          {/* Editorial sidebar */}
          <motion.aside
            className="lg:sticky lg:top-28"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-white/80 font-body backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden />
                Expertise &amp; Support
              </span>
            </div>

            <h2
              id="faq-heading"
              className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance"
            >
              {headline}
            </h2>

            <p className="mt-4 text-base text-white/65 font-body leading-relaxed">
              {subtitle ||
                "Straight answers on scope, timelines, and how we work — before you book a call."}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button
                asChild
                className="h-12 rounded-xl bg-accent text-white hover:bg-accent-hover font-body shadow-lg shadow-accent/20"
              >
                <Link href="/contact">
                  <MessageCircle className="mr-2 h-4 w-4" aria-hidden />
                  Ask a question
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-xl border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white font-body backdrop-blur-sm"
              >
                <Link href="/faq">
                  <HelpCircle className="mr-2 h-4 w-4" aria-hidden />
                  Browse all FAQs
                </Link>
              </Button>
            </div>

            <p className="mt-8 hidden lg:flex items-center gap-2 text-xs text-white/40 font-body">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              {displayFaqs.length} questions answered below
            </p>
          </motion.aside>

          {/* Accordion stack */}
          <div className="space-y-3 md:space-y-4">  
            {displayFaqs.map((item, index) => (
              <FaqItem
                key={item.question}
                item={item}
                index={index}
                isOpen={openIndex === index}
                onToggle={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
