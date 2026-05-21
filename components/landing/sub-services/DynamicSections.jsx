'use client';

import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { makeBoldServiceName, getSectionId } from '@/lib/subservice-utils';

export default function DynamicSections({ sections, serviceName }) {

  return (
    <>
      {sections.map((section, index) => {
        const items = section.items || [];
        const isTwoItems = items.length === 2;

        return (
          <motion.section
            key={section.heading}
            id={getSectionId(section.heading, index)}
            className="scroll-mt-24"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: index * 0.1 }}
          >
            {/* Improved Header */}
            <div className="mx-auto pt-20 pb-12 text-center">
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="h-[2px] w-8 rounded-full bg-accent" />
                <span className="text-[11px] font-medium tracking-[0.08em] uppercase rounded-full border border-border bg-surface text-accent px-3 py-1">
                  Service Detail
                </span>
                <span className="h-[2px] w-8 rounded-full bg-accent" />
              </div>

              <h2
                className="font-display text-3xl md:text-3xl font-bold tracking-tight leading-tight text-slate-900"
                dangerouslySetInnerHTML={{
                  __html: makeBoldServiceName(section.heading, serviceName),
                }}
              />
            </div>

            {/* Content */}
            <div className="mx-auto  pb-16">
              <div className="space-y-6 text-slate-600 leading-relaxed text-[17px]">
                <p
                  dangerouslySetInnerHTML={{
                    __html: makeBoldServiceName(section.body, serviceName),
                  }}
                />
              </div>

              {/* Smart Items Layout */}
              {items.length > 0 && (
                <div className="mt-12">
                  {isTwoItems ? (
                    // 2 Cards Side by Side
                    <div className="grid md:grid-cols-2 gap-6">
                      {items.map((item, i) => (
                        <motion.div
                          key={i}
                          className="rounded-2xl border border-border bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300"
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + i * 0.1 }}
                        >
                          <div className="flex gap-4">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-accent border border-border">
                              <Star className="h-4 w-4 fill-current" />
                            </div>
                            <span
                              className="leading-relaxed text-[17px]"
                              dangerouslySetInnerHTML={{
                                __html: makeBoldServiceName(item, serviceName),
                              }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    // Normal List (1 or 3+ items)
                    <ul className="space-y-6">
                      {items.map((item, i) => (
                        <motion.li
                          key={i}
                          className="flex gap-4"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + i * 0.06 }}
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface text-accent border border-border mt-0.5">
                            <Star className="h-4 w-4 fill-current" />
                          </div>
                          <span
                            className="leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: makeBoldServiceName(item, serviceName),
                            }}
                          />
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="mx-auto ">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
          </motion.section>
        );
      })}
    </>
  );
}