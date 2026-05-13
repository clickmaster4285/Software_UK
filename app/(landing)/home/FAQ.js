"use client";

import { useState } from "react";

const faqs = [
  {
    question: "How much does custom software development cost?",
    answer: "The cost varies based on project scope, complexity, and timeline. We provide detailed quotes after understanding your requirements.",
  },
  {
    question: "How long does it take to build a custom software application?",
    answer: "Timeline depends on project size. Simple apps take 2-3 months, enterprise solutions can take 6-12 months.",
  },
  {
    question: "What technologies does ClickMasters use?",
    answer: "We use modern technologies including React, Next.js, Node.js, Python, TypeScript, and cloud platforms like AWS and Azure.",
  },
  {
    question: "Do you provide post-launch support and maintenance?",
    answer: "Yes, we offer 24/7 ongoing support, security updates, and maintenance services for all our projects.",
  },
  {
    question: "Can ClickMasters work with international clients?",
    answer: "Yes, we serve clients globally across USA, Europe, and Middle East with remote collaboration tools.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-20 bg-surface">
      <div className="max-w-200 mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-4">
            FAQ
          </h2>
          <p className="text-text-body font-body">
            Answers before you start
          </p>
          <p className="text-text-muted font-body text-sm mt-2">
            Everything you need to know about our process, timelines, technology stack, and post-launch support.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden border border-border"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center"
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              >
                <span className="font-heading font-semibold text-primary">
                  {faq.question}
                </span>
                <span className="text-accent text-2xl font-light">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-text-body font-body">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

