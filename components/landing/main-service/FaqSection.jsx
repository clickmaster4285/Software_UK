"use client";

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const defaultFaqs = [
  {
    question: 'How much does custom software development cost?',
    answer:
      'Custom software development costs vary based on complexity, features, and timeline. A basic web application typically starts from $5,000-$15,000, while enterprise systems range from $30,000-$200,000+. We provide free consultations to give accurate project estimates.',
  },
  {
    question: 'How long does it take to build a custom software application?',
    answer:
      'Development timelines depend on the project scope. An MVP takes 6-12 weeks, a full web or mobile application takes 3-6 months, and enterprise systems can take 6-18 months. We use agile sprints to deliver working software every 2 weeks.',
  },
  {
    question: 'What technologies does ClickMasters use?',
    answer:
      "We use modern, proven technologies including React, Next.js, Node.js, Python, Flutter, React Native, PostgreSQL, MongoDB, AWS, Google Cloud, and Azure. We choose the best stack for each project's specific needs.",
  },
  {
    question: 'Do you provide post-launch support and maintenance?',
    answer:
      'Yes. ClickMasters provides 24/7 post-launch support, security updates, performance monitoring, and feature development. We offer monthly maintenance plans to keep your software running smoothly.',
  },
];

export function FaqSection({ faqs: customFaqs }) {
  const [openIndex, setOpenIndex] = useState(null);
  const displayFaqs = customFaqs && customFaqs.length > 0 ? customFaqs : defaultFaqs;

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section 
      className="bg-white py-24 font-sans" 
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-0.5 w-8 rounded-full bg-primary" />
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Expertise & Support
            </p>
            <span className="h-0.5 w-8 rounded-full bg-primary" />
          </div>

          <h2 
            id="faq-heading"
            className="mt-5 font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
          >
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ Items - Dark Navy Pills Design */}
        <div className="space-y-4">
          {displayFaqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`overflow-hidden rounded-2xl transition-all duration-300 border ${
                  isOpen ? "bg-slate-900 border-slate-900 shadow-xl" : "bg-white border-slate-200 hover:border-primary/40"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <h3 className={`text-lg font-heading font-semibold transition-colors duration-300 ${
                    isOpen ? "text-white" : "text-slate-900"
                  }`}>
                    {item.question}
                  </h3>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
                    isOpen ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
                  }`}>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-6 pb-6 border-t border-white/10 pt-4">
                        <p className="text-base leading-relaxed text-slate-300 font-body">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FaqSection;