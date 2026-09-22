'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { linkifyMarkdown } from '@/lib/subservice-utils';
import { getOverviewParas } from '@/components/landing/main-service/hero-section';

const OVERVIEW_IMAGE = '/landing/main-services/people-starting-business-project.png';
const EASE = [0.22, 1, 0.36, 1];

/**
 * Below-fold overview: image left, MD intro copy right — calm entrance motion.
 */
export default function OverviewSection({ serviceData }) {
  const reducedMotion = useReducedMotion();
  const paras = getOverviewParas(serviceData);
  const firstSection = serviceData?.sections?.[0];
  const sectionBlurb =
    firstSection &&
    typeof firstSection.body === 'string' &&
    firstSection.body.trim().length > 40 &&
    firstSection.body.trim().length < 600
      ? firstSection.body.trim()
      : null;

  if (paras.length === 0 && !sectionBlurb) return null;

  const title = serviceData?.title || 'our services';
  const bodyParas =
    paras.length > 0
      ? paras
      : sectionBlurb
        ? [sectionBlurb]
        : [];

  const fadeUp = (delay = 0) => {
    if (reducedMotion) return {};
    return {
      initial: { opacity: 0, y: 18 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: '-60px' },
      transition: { duration: 0.55, delay, ease: EASE },
    };
  };

  const imageMotion = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, x: -24 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true, margin: '-60px' },
        transition: { duration: 0.65, ease: EASE },
      };

  return (
    <section
      className="relative py-16 md:py-24 bg-background border-b border-border/40 overflow-hidden"
      aria-labelledby="overview-heading"
    >
      <div className="mx-auto max-w-[96vw] lg:max-w-[90vw] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:gap-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] items-center">
          {/* Left — image */}
          <motion.div
            className="relative w-full order-2 lg:order-1 group"
            {...imageMotion}
          >
            <div className="relative aspect-4/3 overflow-hidden rounded-xl border border-border/50 bg-surface shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
              <Image
                src={OVERVIEW_IMAGE}
                alt={`Team collaborating on ${title}`}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                sizes="(max-width: 1024px) 100vw, 45vw"
                priority={false}
              />
              <div
                className="pointer-events-none absolute inset-0 bg-linear-to-tr from-primary/10 via-transparent to-accent/5 opacity-80"
                aria-hidden
              />
            </div>
            {/* Soft accent bar under image */}
            <div
              className="mt-4 h-1 w-16 rounded-full bg-accent/70"
              aria-hidden
            />
          </motion.div>

          {/* Right — text */}
          <div className="order-1 lg:order-2">
            <motion.p className="section-label mb-4" {...fadeUp(0)}>
              Overview
            </motion.p>

            <motion.h2
              id="overview-heading"
              className="font-heading text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-6 md:mb-8 text-balance"
              {...fadeUp(0.08)}
            >
              What this means for your project
            </motion.h2>

            <div className="space-y-5 font-body text-base md:text-lg text-text-body leading-relaxed [&_a]:text-accent [&_a]:font-medium [&_a:hover]:underline">
              {bodyParas.map((p, i) => (
                <motion.p
                  key={`overview-p-${i}`}
                  {...fadeUp(0.14 + i * 0.07)}
                  dangerouslySetInnerHTML={{ __html: linkifyMarkdown(p) }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
