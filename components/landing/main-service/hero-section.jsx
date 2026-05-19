'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText } from 'lucide-react';

const heroBullets = [
  'MVP to full-scale SaaS development',
  'Native, cross-platform & enterprise mobile apps',
  'AI & automation systems',
  'ERP, CRM, and enterprise solutions',
  'Built for scalability, performance & ROI',
];

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

  useEffect(() => {
    if (!isInView) return;

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
  }, [isInView, end, duration, delay]);

  return <span ref={ref}>{count}+</span>;
};

const stats = [
  { end: 1860, label: 'Projects Delivered' },
  { end: 3500, label: 'Happy Clients' },
  { end: 75, label: 'Awards Won' },
  { end: 5, label: 'Years Experience' },
];

const Typewriter = ({ texts, typingSpeed = 80, deletingSpeed = 40, pauseTime = 1500 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    let timer;

    if (isWaiting) {
      timer = setTimeout(() => {
        setIsWaiting(false);
        setIsDeleting(true);
      }, pauseTime);
      return () => clearTimeout(timer);
    }

    const currentText = texts[currentIndex];

    if (isDeleting) {
      if (displayText.length === 0) {
        timer = setTimeout(() => {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }, deletingSpeed);
      } else {
        timer = setTimeout(() => {
          setDisplayText((prev) => prev.slice(0, -1));
        }, deletingSpeed);
      }
    } else {
      if (displayText.length === currentText.length) {
        timer = setTimeout(() => setIsWaiting(true), 0);
      } else {
        timer = setTimeout(() => {
          setDisplayText((prev) => currentText.slice(0, prev.length + 1));
        }, typingSpeed);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, isWaiting, currentIndex, texts, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <span className="inline-block min-w-70 text-left text-accent font-medium sm:min-w-85 md:min-w-100">
      {displayText}
      <span className="inline-block h-5 w-0.5 -mb-0.5 bg-accent animate-pulse" />
    </span>
  );
};

export function HeroSection({ serviceData }) {
  const displayStats = serviceData?.stats || stats;
  const displayBullets = serviceData?.features?.map((f) => f.title) || heroBullets;
  const heroImageUrl = serviceData?.heroImage ;

  return (
    <section
      className="relative w-full min-h-screen flex items-center overflow-hidden" 
      aria-labelledby="hero-heading"
    >
      {/* Background Image - Full length and width coverage */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/landing/main-services/hero-bg.png')" }}
      />
      
      {/* Constraints for the main content */}
      <div className="relative z-10 w-full max-w-400 mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_480px] items-center">

          {/* ── Left column ── */}
          <div className="flex flex-col justify-center text-left">

            {/* Badge */}
            {serviceData?.heroBadge && (
              <div className="mb-6">
                <span className="section-label">{serviceData.heroBadge}</span>
              </div>
            )}

            {/* Heading */}
            <div className="mb-6 md:mb-8">
              <div className="overflow-hidden">
                <h1
                  id="hero-heading"
                  className="font-heading text-[2.5rem] font-bold leading-tight tracking-tight text-accent sm:text-5xl md:text-6xl lg:text-7xl"
                >
                  {serviceData?.title || 'Software Development'}
                </h1>
              </div>
              <div className="overflow-hidden mt-3">
                <div className="font-heading text-[1.5rem] font-semibold leading-tight tracking-tight text-primary sm:text-2xl md:text-3xl lg:text-4xl">
                  {serviceData?.tagline || 'That Scales Your Business Revenue'}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="font-body text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed mb-8 max-w-2xl">
              {serviceData?.description ||
                'We design, build, and deploy high-performance systems for companies globally.'}
            </p>

            {/* Typewriter */}
            <div className="mb-10">
              <div className="inline-block rounded-2xl bg-white/5 px-4 sm:px-6 py-3 backdrop-blur-sm border  max-w-full overflow-hidden border-accent/">
                <div className="text-left text-sm sm:text-base lg:text-lg font-medium text-accent">
                  <Typewriter
                    texts={displayBullets}
                    typingSpeed={60}
                    deletingSpeed={30}
                    pauseTime={2000}
                  />
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="btn-primary group " asChild>
                <Link href="/contact">
                  {serviceData?.ctaText || 'Get Started'}
                  <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
              >
                <Link href="/contact">
                  <FileText className="mr-2 h-5 w-5" />
                  Request Proposal
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div
              className="mt-8 lg:mt-14 grid grid-cols-2 gap-x-8 gap-y-10 pt-8 border-t border-white/10 md:grid-cols-4 md:gap-x-12"
              role="list"
              aria-label="Service achievements"
            >
              {displayStats.map((stat, index) => (
                <div key={stat.label} className="text-left" role="listitem">
                  <p className="font-heading text-2xl md:text-3xl font-bold tabular-nums text-white tracking-tight">
                    {stat.value && typeof stat.value === 'string' && stat.value.includes('+') ? (
                      <Counter end={parseInt(stat.value)} duration={2.2} delay={0.1 * index} />
                    ) : (
                      <span>{stat.value || stat.end}</span>
                    )}
                  </p>
                  <p className="mt-1 text-sm text-gray-300 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right column — Service image ── */}
          <div className="hidden lg:flex items-center justify-center w-full">
            <div className="w-full max-w-xl">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10 aspect-4/3 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroImageUrl}
                  alt={serviceData?.title || 'Service'}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Gradient overlay on image bottom */}
                <div className="absolute inset-0 bg-linear-to-t from-primary/60 via-transparent to-transparent" />
                {/* Branded badge */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-white text-sm font-semibold font-heading">
                      {serviceData?.title || 'Our Services'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
