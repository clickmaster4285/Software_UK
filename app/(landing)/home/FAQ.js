'use client';

import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle, MessageCircle } from 'lucide-react';

const faqs = [
  {
    question: "How much does custom software development cost?",
    answer: "The cost varies based on project scope, complexity, and timeline. We provide detailed quotes after understanding your requirements and conducting a thorough discovery phase.",
  },
  {
    question: "How long does it take to build a custom application?",
    answer: "Timeline depends on project size. Simple apps take 2-3 months, while enterprise solutions can take 6-12 months. We use agile methodology to deliver value iteratively.",
  },
  {
    question: "What technologies does ClickMasters use?",
    answer: "We use modern technologies including React, Next.js, Node.js, Python, TypeScript, and cloud platforms like AWS and Azure to ensure scalability and performance.",
  },
  {
    question: "Do you provide post-launch support?",
    answer: "Yes, we offer ongoing support, security updates, and maintenance services. We ensure your software stays up-to-date and scales with your business needs.",
  },
  {
    question: "Can you work with international clients?",
    answer: "Yes, we serve clients globally. We use remote collaboration tools and async workflows to ensure seamless communication across all time zones.",
  },
  {
    question: "Do you offer white-label development?",
    answer: "Yes, we partner with agencies and consulting firms to provide white-label software development services with strict NDA compliance.",
  },
];

export default function FAQ() {
  return (
    <section className="py-24 bg-surface relative overflow-hidden">
      {/* Background Decorative Elements using global CSS colors */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-[11px] font-medium uppercase tracking-[0.08em] mb-4 border border-border">
            <HelpCircle className="w-3.5 h-3.5 text-accent" />
            <span>Common Questions</span>
          </div>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-primary mb-4 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-text-body font-body max-w-2xl mx-auto text-lg">
            Everything you need to know about our process, technology, and how we help businesses scale.
          </p>
        </div>

        {/* Stable Single Column to avoid layout shift between columns */}
        <div className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white rounded-xl border border-border px-6 mb-4 shadow-sm hover:border-accent/20 transition-all duration-300"
              >
                <AccordionTrigger className="hover:no-underline py-5 text-left font-heading font-semibold text-primary data-[state=open]:text-accent">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-text-body font-body leading-relaxed pb-6 pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Still Have Questions? - Colors from Global CSS */}
        <div className="mt-16 bg-primary rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden group shadow-2xl shadow-primary/20">
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <h3 className="font-heading text-2xl font-bold mb-4">Still have questions?</h3>
            <p className="text-white/80 font-body mb-8 max-w-xl mx-auto">
              Can&apos;t find the answer you&apos;re looking for? Reach out to our team directly and we&apos;ll be happy to help you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/contact" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-heading font-bold rounded-xl hover:bg-accent-hover transition-all shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5 active:translate-y-0"
              >
                <MessageCircle className="w-5 h-5" />
                Contact Support
              </Link>
              <span className="text-white/60 font-body text-sm">Or email us at support@clickmasters.uk</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

