'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText } from 'lucide-react';
import Image from 'next/image';
import { linkifyMarkdown } from '@/lib/subservice-utils';

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

function useInViewOnce(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || done.current) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          done.current = true;
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: '40px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);

  return visible;
}

const Counter = ({ end, duration = 2, delay = 0 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInViewOnce(ref, 0.2);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (reducedMotion) {
      setCount(end);
      return;
    }

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.min(Math.floor(end * progress), end));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    const timeoutId = window.setTimeout(() => {
      animationFrame = requestAnimationFrame(animate);
    }, delay * 1000);

    return () => {
      window.clearTimeout(timeoutId);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isInView, end, duration, delay, reducedMotion]);

  return <span ref={ref}>{count}+</span>;
};

function paraText(p) {
  return typeof p === 'string' ? p : p?.text || '';
}

/**
 * Hero description: short scannable copy — prefer metaDescription, then curated description.
 * Never dump the long MD intro (that belongs in Overview).
 */
export function getHeroDescription(serviceData) {
  const meta = String(serviceData?.metaDescription || '').trim();
  const desc = String(serviceData?.description || '').trim();

  if (meta.length >= 50) return meta;
  if (desc.length >= 40) return desc;
  if (meta) return meta;
  if (desc) return desc;

  // Last resort: first sentence of intro
  const intro0 = paraText(serviceData?.intro?.[0]);
  if (!intro0) {
    return 'We design, build, and deploy high-performance systems for companies globally.';
  }
  const stop = intro0.search(/[.?!]\s/);
  if (stop > 40 && stop < 200) return intro0.slice(0, stop + 1).trim();
  return intro0.length <= 200 ? intro0 : `${intro0.slice(0, 180).trim()}…`;
}

/** @deprecated use getHeroDescription — kept for Overview helpers */
export function getHeroLead(serviceData) {
  return getHeroDescription(serviceData);
}

/** Full MD intro for Overview (hero no longer consumes intro[0]). */
export function getOverviewParas(serviceData) {
  const intro = serviceData?.intro;
  if (!Array.isArray(intro) || intro.length === 0) return [];
  return intro.map(paraText).filter(Boolean);
}

function shouldShowTagline(h1, tagline, heroDescription) {
  if (!tagline || typeof tagline !== 'string') return false;
  const t = tagline.trim();
  if (!t) return false;
  const title = (h1 || '').trim();
  if (t.toLowerCase() === title.toLowerCase()) return false;
  // Skip if tagline duplicates the hero description (software MD quirk)
  if (heroDescription && t.toLowerCase() === heroDescription.toLowerCase()) return false;
  if (heroDescription && heroDescription.toLowerCase().startsWith(t.toLowerCase()) && t.length > 40) {
    return false;
  }
  // Not a marketing tagline — long body copy
  if (t.length > 90) return false;
  if (/^Looking for |^Clickmasters /i.test(t)) return false;
  return true;
}

function resolveHeroCtas(serviceData) {
  const primary = serviceData?.cta?.primary;
  const secondary = serviceData?.cta?.secondary;

  const primaryText =
    (typeof primary === 'object' && primary?.buttonText) ||
    serviceData?.ctaText ||
    'Book a Free Consultation';
  const primaryUrl =
    (typeof primary === 'object' && primary?.buttonUrl) || '/contact';

  let secondaryText = 'Request Proposal';
  if (typeof secondary === 'string' && secondary.trim()) {
    secondaryText = secondary.length <= 48 ? secondary.trim() : 'Request Proposal';
  } else if (secondary && typeof secondary === 'object' && secondary.buttonText) {
    secondaryText = secondary.buttonText;
  }

  return { primaryText, primaryUrl, secondaryText, secondaryUrl: '/contact' };
}

export function HeroSection({ serviceData }) {
  const displayStats = serviceData?.stats;
  const heroImageUrl = serviceData?.heroImage;
  // Title = MD H1 (SEO); fallback to curated short title
  const h1 = serviceData?.h1 || serviceData?.title || 'Software Development';
  const tagline = serviceData?.tagline;
  const heroDescription = getHeroDescription(serviceData);
  const showTagline = shouldShowTagline(h1, tagline, heroDescription);
  const { primaryText, primaryUrl, secondaryText, secondaryUrl } = resolveHeroCtas(serviceData);

  return (
    <section
      className="relative w-full min-h-[70vh] flex items-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/landing/main-services/hero-bg.webp')" }}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-[96vw] lg:max-w-[90vw] mx-auto px-4 py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] items-center">
          <div className="flex flex-col justify-center text-left">
            {serviceData?.heroBadge && (
              <div className="mb-5">
                <span className="section-label">{serviceData.heroBadge}</span>
              </div>
            )}

            <div className="mb-5 md:mb-6">
              <h1
                id="hero-heading"
                className="font-heading text-[2.25rem] font-bold leading-[1.15] tracking-tight text-accent sm:text-5xl md:text-6xl lg:text-[3.75rem] text-balance"
              >
                {h1}
              </h1>
              {showTagline && (
                <p className="mt-3 font-heading text-xl font-semibold leading-snug tracking-tight text-primary sm:text-2xl md:text-3xl">
                  {tagline}
                </p>
              )}
            </div>

            <p
              className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl [&_a]:text-accent [&_a]:font-medium [&_a:hover]:underline"
              dangerouslySetInnerHTML={{ __html: linkifyMarkdown(heroDescription) }}
            />

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <Button size="lg" className="btn-primary group w-full sm:w-auto" asChild>
                <Link href={primaryUrl}>
                  {primaryText}
                  <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/80" asChild>
                <Link href={secondaryUrl}>
                  <FileText className="mr-2 h-5 w-5" />
                  {secondaryText}
                </Link>
              </Button>
            </div>

            {Array.isArray(displayStats) && displayStats.length > 0 && (
              <div
                className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 pt-8 border-t border-border/40 md:grid-cols-4 md:gap-x-10"
                role="list"
                aria-label="Service achievements"
              >
                {displayStats.map((stat, index) => (
                  <div key={stat.label} className="text-left" role="listitem">
                    <p className="font-heading text-2xl md:text-3xl font-bold tabular-nums text-primary tracking-tight">
                      {stat.value && typeof stat.value === 'string' && stat.value.includes('+') ? (
                        <Counter end={parseInt(stat.value, 10)} duration={2.2} delay={0.1 * index} />
                      ) : (
                        <span>{stat.value || stat.end}</span>
                      )}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {heroImageUrl && (
            <div className="hidden lg:flex items-center justify-center w-full">
              <div className="w-full max-w-md">
                <div className="relative overflow-hidden aspect-5/6 rounded-md">
                  <Image
                    width={560}
                    height={420}
                    src={heroImageUrl}
                    alt=""
                    className="w-full h-full object-cover"
                    priority
                  />
                  <div
                    className="absolute inset-0 bg-linear-to-t from-primary/40 via-transparent to-transparent"
                    aria-hidden
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
