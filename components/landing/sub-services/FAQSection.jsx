"use client";
// components/landingPagePage/FAQSection.tsx
import { ChevronDown, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const FAQSection = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Helper function to make text bold with accent color
  const makeBoldWithColor = (text) => {
    if (!text) return text;

    // Match text that's already marked for bolding (look for existing bold patterns or key terms)
    // For now, we'll make terms like "Custom Software Development" bold and orange
    const parts = [];
    const keywords = ['custom software development', 'ai development', 'mobile development', 'web development', 'data engineering', 'ui/ux design'];

    const lastIndex = 0;
    const lowerText = text.toLowerCase();

    keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      if (regex.test(lowerText)) {
        const split = text.split(new RegExp(`(${keyword})`, 'gi'));
        parts.length = 0; // clear parts
        split.forEach((part, idx) => {
          if (part.toLowerCase() === keyword) {
            parts.push(
              <span key={idx} className="font-bold text-accent">
                {part}
              </span>
            );
          } else {
            parts.push(part);
          }
        });
      }
    });

    return parts.length > 0 ? parts : text;
  };

  if (!faqs || faqs.length === 0) return null;

  // Split FAQs into two columns to prevent layout shift across columns
  const midIndex = Math.ceil(faqs.length / 2);
  const columns = [
    faqs.slice(0, midIndex),
    faqs.slice(midIndex)
  ];

  const FAQItem = ({ faq, actualIndex }) => (
    <div
      className="group relative overflow-hidden rounded-2xl border border-border bg-white transition-all duration-300 hover:border-accent/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
      style={{ height: 'fit-content' }}
    >
      <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-accent to-accent-hover transition-all duration-500 group-hover:w-full" />
      <button
        onClick={() => toggleFAQ(actualIndex)}
        className="flex w-full items-center justify-between p-6 text-left transition-colors"
      >
        <h3 className="pr-8 font-semibold text-slate-900 group-hover:text-accent transition-colors">
          {makeBoldWithColor(faq.question)}
        </h3>
        <ChevronDown
          className={`h-5 w-5 shrink-0 transition-all duration-300 ${openIndex === actualIndex ? 'rotate-180 text-accent' : 'text-slate-400'}`}
        />
      </button>

      <AnimatePresence>
        {openIndex === actualIndex && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/50 bg-slate-50/30 px-6 pb-6 pt-5">
              <p className="text-[15px] leading-relaxed text-slate-600">
                {makeBoldWithColor(faq.answer)}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <section id="faq" className="relative scroll-mt-24 py-16 md:py-24 mx-auto max-w-400 overflow-hidden">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute top-1/4 -right-16 h-72 w-72 rounded-full bg-accent/5 blur-[100px]" />
        <div className="absolute bottom-1/4 -left-16 h-72 w-72 rounded-full bg-primary/5 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: "radial-gradient(var(--text-muted) 0.5px, transparent 0.5px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="flex flex-col gap-4 mb-12">
        <div className="max-w-3xl">
          <p className="mb-3 inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-accent">
            Common Inquiries
          </p>
          <div className="flex items-start gap-3">
            <div className="mt-1 h-10 w-1 shrink-0 rounded-full bg-accent" />
            <h2 className="font-heading text-2xl font-semibold leading-snug text-slate-900 sm:text-3xl">
              Frequently Asked <span className="text-accent">Questions</span>
            </h2>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 items-start">
        {columns.map((columnFaqs, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-4">
            {columnFaqs.map((faq, index) => (
              <FAQItem 
                key={index} 
                faq={faq} 
                actualIndex={colIdx === 0 ? index : index + midIndex} 
              />
            ))}
          </div>
        ))}
      </div>

      {/* Contact Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-12 md:mt-16 rounded-3xl border border-border bg-gradient-to-br from-surface to-white p-8 md:p-10 text-center shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
      >
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <MessageCircle className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 md:text-2xl">
          Still have questions?
        </h3>
        <p className="mt-3 text-slate-600 max-w-lg mx-auto">
          Can&apos;t find the answer you&apos;re looking for? Please chat to our friendly team.
        </p>
        <div className="mt-8">
          <Button asChild className="bg-accent hover:bg-accent-hover text-white rounded-xl px-8 py-6 font-semibold shadow-lg shadow-accent/20 transition-all hover:-translate-y-0.5 border-0">
            <Link href="/contact-us">Get in touch</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
};