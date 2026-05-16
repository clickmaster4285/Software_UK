'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, Mail, User, Phone, Send, CheckCircle2, DollarSign } from 'lucide-react';
import { NeonOrbs } from '@/components/ui/neon-orbs';

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

// Typewriter Component
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
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % texts.length);
      } else {
        timer = setTimeout(() => {
          setDisplayText((prev) => prev.slice(0, -1));
        }, deletingSpeed);
      }
    } else {
      if (displayText.length === currentText.length) {
        setIsWaiting(true);
      } else {
        timer = setTimeout(() => {
          setDisplayText((prev) => currentText.slice(0, prev.length + 1));
        }, typingSpeed);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, isWaiting, currentIndex, texts, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <span className="inline-block min-w-70 text-left text-primary font-medium sm:min-w-85 md:min-w-100">
      {displayText}
      <span className="inline-block h-5 w-0.5 -mb-0.5 bg-primary animate-pulse" />
    </span>
  );
};

import { useContactMutation } from '@/hooks/useContact';

export function HeroSection({ serviceData }) {
  const [heroForm, setHeroForm] = useState({
    name: '',
    email: '',
    phone: '',
    budget: '',
    message: '',
  });

  const { sendMessage, isSending, isSuccess, error } = useContactMutation();

  const heroFieldClass = "w-full rounded-xl border border-white/25 bg-white/5 px-3 py-2.5 pl-9 text-base sm:text-sm text-white placeholder:text-gray-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all duration-200";

  const handleHeroChange = (e) => {
    const { name, value } = e.target;
    setHeroForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleHeroSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendMessage({
        ...heroForm,
        services: `Main Service: ${serviceData?.title || 'General Inquiry'}`,
        source: 'Hero Form'
      });
      setHeroForm({ name: '', email: '', phone: '', budget: '', message: '' });
    } catch (err) {
      console.error('Submission failed:', err);
    }
  };

  const displayStats = serviceData?.stats || stats;
  const displayBullets = serviceData?.features?.map(f => f.title) || heroBullets;

  return (
    <section
      className="relative min-h-screen flex flex-col lg:flex-row lg:items-stretch overflow-x-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 -z-30">
        <NeonOrbs />
      </div>
      <div className="absolute inset-0 -z-20 bg-black/60 backdrop-blur-[2px]" />

      <div className="container relative z-10 mx-auto w-full max-w-full min-w-0 px-3 sm:px-4 lg:px-14 flex flex-col justify-center min-h-screen">
        <div className="mx-auto w-full min-w-0 px-4 sm:px-6 lg:px-10">
          <div className="grid gap-10 pt-24 pb-10 lg:pt-0 lg:pb-0 lg:min-h-screen lg:grid-cols-[1fr_400px] xl:gap-16 lg:items-center">

            {/* Left column */}
            <div className="flex flex-col justify-center text-left">
              {/* Badge */}
              {serviceData?.heroBadge && (
                <div className="animate-slide-in-up mb-6">
                  <span className="section-label">
                    {serviceData.heroBadge}
                  </span>
                </div>
              )}

              {/* Heading */}
              <div className="mb-6 md:mb-8">
                <div className="overflow-hidden">
                  <h1 id="hero-heading" className="animate-slide-in-up font-heading text-[2rem] font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                     {serviceData?.title || "Software Development"}
                  </h1>
                </div>
                <div className="overflow-hidden mt-3">
                  <div className="animate-slide-in-up font-heading text-[1.5rem] font-semibold leading-tight tracking-tight text-gray-300 sm:text-2xl md:text-3xl lg:text-4xl">
                    {serviceData?.tagline || "That Scales Your Business Revenue"}
                  </div>
                </div>
              </div>

              {/* Sub-description */}
              <p className="animate-slide-in-up font-body text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed mb-8 max-w-2xl">
                {serviceData?.description || "We design, build, and deploy high-performance systems for companies globally."}
              </p>

              {/* Typewriter / Features */}
              <div className="animate-slide-in-up mb-10">
                <div className="inline-block rounded-2xl bg-white/5 px-4 sm:px-6 py-3 backdrop-blur-sm border border-white/10 max-w-full overflow-hidden">
                  <div className="text-left text-sm sm:text-base lg:text-lg font-medium text-gray-100">
                    <Typewriter texts={displayBullets} typingSpeed={60} deletingSpeed={30} pauseTime={2000} />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="animate-slide-in-up flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="btn-primary group w-full sm:w-auto min-h-13"
                  asChild
                >
                  <Link href="/contact">
                    {serviceData?.ctaText || "Get Started"}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto min-h-13 rounded-xl border-white/30 text-white hover:bg-white/10 transition-colors"
                  asChild
                >
                  <Link href="/contact">
                    <FileText className="mr-2 h-5 w-5" />
                    Request Proposal
                  </Link>
                </Button>
              </div>

              {/* Stats Section */}
              <div
                className="animate-slide-in-up mt-8 lg:mt-14 grid grid-cols-2 gap-x-8 gap-y-10 pt-8 border-t border-white/10 md:grid-cols-4 md:gap-x-12"
                role="list"
                aria-label="Service achievements"
              >
                {displayStats.map((stat, index) => (
                  <div key={stat.label} className="text-left" role="listitem">
                    <p className="font-heading text-2xl md:text-3xl font-bold tabular-nums text-white tracking-tight">
                      {typeof stat.value === 'string' && stat.value.includes('+') ? (
                        <Counter end={parseInt(stat.value)} duration={2.2} delay={0.1 * index} />
                      ) : (
                        <span>{stat.value}</span>
                      )}
                    </p>
                    <p className="mt-1 text-sm text-gray-400 font-medium">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column CTA Form */}
            <div className="flex items-center justify-center lg:h-screen w-full">
              <div className="animate-slide-in-up w-full max-w-md">
                <div className="rounded-2xl border border-white/15 bg-black/40 p-6 sm:p-8 shadow-2xl shadow-black/50 backdrop-blur-xl">
                  <h2 className="font-heading text-xl font-bold text-white mb-2">Get a free quote</h2>
                  <p className="mb-6 text-sm text-gray-300 font-body">
                    Share your details we&apos;ll respond within one business day.
                  </p>

                  {error && (
                    <div className="mb-4 rounded-xl border border-red-400/40 bg-red-950/50 px-4 py-3 text-sm text-red-100">
                      {error?.message || 'Something went wrong'}
                    </div>
                  )}

                  {isSuccess ? (
                    <div className="rounded-xl bg-green-950/40 border border-green-400/30 p-8 text-center">
                      <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-accent" />
                      <p className="font-heading font-semibold text-white">Message received!</p>
                      <p className="mt-1 text-sm text-gray-300 font-body">We&apos;ll get back to you shortly.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleHeroSubmit} className="space-y-4">
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={heroForm.name}
                          onChange={handleHeroChange}
                          placeholder="Full name"
                          className={heroFieldClass}
                          required
                        />
                      </div>

                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={heroForm.email}
                          onChange={handleHeroChange}
                          placeholder="Work email"
                          className={heroFieldClass}
                          required
                        />
                      </div>

                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={heroForm.phone}
                          onChange={handleHeroChange}
                          placeholder="Phone (optional)"
                          className={heroFieldClass}
                        />
                      </div>

                      <div className="relative">
                        <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="budget"
                          value={heroForm.budget}
                          onChange={handleHeroChange}
                          placeholder="Estimated budget (optional)"
                          className={heroFieldClass}
                        />
                      </div>

                      <textarea
                        name="message"
                        rows={3}
                        value={heroForm.message}
                        onChange={handleHeroChange}
                        placeholder="What would you like to build?"
                        className="min-h-25 w-full resize-none rounded-xl border border-white/25 bg-white/5 px-3 py-3 text-sm text-white placeholder:text-gray-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all duration-200 font-body"
                        required
                      />

                      <button
                        type="submit"
                        disabled={isSending}
                        className="btn-primary w-full min-h-13 text-base"
                      >
                        {isSending ? 'Sending...' : 'Send Message'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in-up {
          animation: slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
}
