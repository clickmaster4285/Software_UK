'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { NavigationWheel } from '@/app/(landing)/[category]/[service]/NavigationWheel';
import { ArrowRight, CheckCircle, ChevronDown, ChevronUp, Rocket, ArrowLeft, Code2, Globe, Smartphone, Palette, Bot, Brain, MessageSquare, BarChart3, Settings2, Cloud, Database, Shield, FlaskConical, Users, Blocks, Cpu, Glasses, MessageCircle, TrendingUp, } from 'lucide-react';

const categoryIcons = {
  'Software Development': Code2,
  'Web Development': Globe,
  'Mobile Development': Smartphone,
  'Design': Palette,
  'Artificial Intelligence (AI)': Bot,
  'Machine Learning (ML)': Brain,
  'NLP & Computer Vision': MessageSquare,
  'Data Services': BarChart3,
  'Automation & Integration': Settings2,
  'Cloud & DevOps': Cloud,
  'Database Services': Database,
  'Cybersecurity': Shield,
  'Testing & QA': FlaskConical,
  'Support & Outsourcing': Users,
  'Blockchain & Web3': Blocks,
  'IoT & Emerging Tech': Cpu,
  'Immersive Tech': Glasses,
  'Automation & Chatbot': MessageCircle,
  'Data & Intelligence': TrendingUp,
};

export default function ServiceDetailClient({ service, categorySlug }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollDir, setScrollDir] = useState('down');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [wheelTop, setWheelTop] = useState(-360); // Start hidden (using desktop size as default)

  const lastScrollY = useRef(0);
  const lenisRef = useRef(null);
  const rafIdRef = useRef(null);

  // ── Build sections array ──────────────────────────────────────────────────
  const sections = [
    { id: 'hero', label: 'Overview' },
    ...(service.highlights?.length
      ? [{ id: 'benefits', label: 'Benefits' }]
      : []),
    ...(service.sections?.length
      ? service.sections.map((s, i) => ({ id: `section-${i}`, label: s.heading }))
      : []),
    ...(service.howToSteps?.length
      ? [{ id: 'process', label: 'Process' }]
      : []),
    ...(service.itemList?.length
      ? [{ id: 'deliver', label: 'Deliver' }]
      : []),
    ...(service.definedTerms?.length
      ? [{ id: 'terms', label: 'Terms' }]
      : []),
    ...(service.faqs?.length
      ? [{ id: 'faq', label: 'FAQ' }]
      : []),
  ];

  // ── Helper function to get wheel height based on screen width ─────────────
  const getWheelHeight = () => {
    if (typeof window === 'undefined') return 360;
    const width = window.innerWidth;
    if (width >= 1024) return 360;  // Desktop
    if (width >= 768) return 230;   // Tablet
    return 180;                      // Mobile
  };

  // ── Lenis smooth scroll setup ─────────────────────────────────────────────
  useEffect(() => {
    let lenis;

    async function initLenis() {
      const { default: Lenis } = await import('@studio-freight/lenis');

      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true,
      });

      lenisRef.current = lenis;

      function raf(time) {
        lenis.raf(time);
        rafIdRef.current = requestAnimationFrame(raf);
      }
      rafIdRef.current = requestAnimationFrame(raf);

      lenis.on('scroll', ({ scroll, direction, limit }) => {
        const st = scroll;
        const vh = window.innerHeight;
        const dir = direction > 0 ? 'down' : 'up';

        setScrollDir(dir);

        // Calculate scroll progress for wheel rotation (0 to 1)
        const maxScroll = limit;
        const progress = Math.min(st / maxScroll, 1);
        setScrollProgress(progress);

        // Get dynamic wheel height based on screen width
        const wheelHeight = getWheelHeight();
        const NAVBAR_H = 72;
        const SCROLL_START = 80; // pixels scrolled before wheel appears

        if (st < SCROLL_START) {
          setWheelTop(-wheelHeight);
        } else {
          const minTop = NAVBAR_H + 16;
          const maxTop = vh - wheelHeight - 16;
          const scrollRange = maxScroll - SCROLL_START;
          const scrollAmount = Math.max(0, st - SCROLL_START);
          let topPos = minTop + (scrollAmount / scrollRange) * (maxTop - minTop);
          topPos = Math.min(maxTop, Math.max(minTop, topPos));
          setWheelTop(topPos);
        }

        // Active section detection
        const sectionElements = [
          { id: 'hero', el: document.getElementById('hero') },
          ...(service.highlights?.length ? [{ id: 'benefits', el: document.getElementById('benefits') }] : []),
          ...(service.sections?.length ? service.sections.map((_, i) => ({ id: `section-${i}`, el: document.getElementById(`section-${i}`) })) : []),
          ...(service.howToSteps?.length ? [{ id: 'process', el: document.getElementById('process') }] : []),
          ...(service.itemList?.length ? [{ id: 'deliver', el: document.getElementById('deliver') }] : []),
          ...(service.definedTerms?.length ? [{ id: 'terms', el: document.getElementById('terms') }] : []),
          ...(service.faqs?.length ? [{ id: 'faq', el: document.getElementById('faq') }] : []),
        ].filter(s => s.el);

        for (let i = sectionElements.length - 1; i >= 0; i--) {
          const rect = sectionElements[i].el.getBoundingClientRect();
          if (rect.top <= NAVBAR_H + 100) {
            setActiveSection(sectionElements[i].id);
            break;
          }
        }
      });
    }

    initLenis();

    return () => {
      lenis?.destroy();
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [service]);

  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);
  const IconComponent = categoryIcons[service.category] || Code2;

  return (
    <div className="min-h-screen bg-white pt-18">
      {/* Navigation Wheel */}
      <NavigationWheel
        sections={sections}
        activeSection={activeSection}
        scrollDirection={scrollDir}
        wheelTop={wheelTop}
        lenisRef={lenisRef}
        scrollProgress={scrollProgress}
        isVisible={wheelTop >= 0}  // Add this prop
      />

      {/* Breadcrumb */}
      <div className="bg-surface border-b border-border">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-text-muted">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/${categorySlug}`} className="hover:text-accent transition-colors">
              {service.category}
            </Link>
            <span>/</span>
            <span className="text-primary">{service.title}</span>
          </nav>
        </div>
      </div>

      {/* ── Hero ── */}
      <section id="hero" className="py-16 md:py-24 bg-linear-to-br from-surface to-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-accent/10">
                <IconComponent className="w-6 h-6 text-accent" />
              </div>
              <span className="text-sm font-medium text-accent bg-accent/10 px-3 py-1 rounded-full">
                {service.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6 tracking-tight font-heading">
              {service.title}
            </h1>

            <p className="text-lg md:text-xl text-text-body leading-relaxed mb-8 font-body">
              {service.lead}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/contact-us">
                <button className="px-6 py-3 md:px-8 md:py-4 bg-accent text-white text-sm font-medium tracking-wider rounded-md hover:bg-accent-hover transition-colors">
                  <span className="flex items-center justify-center">
                    Get started
                    <Rocket className="ml-2 h-4 w-4" />
                  </span>
                </button>
              </Link>
              <Link href="/case-studies">
                <button className="px-6 py-3 md:px-8 md:py-4 bg-transparent text-primary text-sm font-medium tracking-wider border border-border hover:border-accent/50 transition-colors rounded-md">
                  View case studies
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      {service.highlights?.length > 0 && (
        <section id="benefits" className="py-16 bg-surface">
          <div className="container mx-auto max-w-7xl px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 font-heading">
              Key <span className="text-accent">Benefits</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-3 p-6 bg-white rounded-xl border border-border">
                  <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-text-body">{h}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Content sections ── */}
      {service.sections?.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="max-w-4xl space-y-16">
              {service.sections.map((section, i) => (
                <div key={i} id={`section-${i}`}>
                  <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 font-heading">
                    {section.heading}
                  </h2>
                  <div className="text-text-body leading-relaxed text-base md:text-lg space-y-4 font-body">
                    {section.body.split('\n').map((p, pi) => <p key={pi}>{p}</p>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Process ── */}
      {service.howToSteps?.length > 0 && (
        <section id="process" className="py-16 bg-surface">
          <div className="container mx-auto max-w-7xl px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 text-center font-heading">
              Our <span className="text-accent">Process</span>
            </h2>
            <div className="max-w-4xl mx-auto space-y-4">
              {service.howToSteps.map((step, i) => (
                <div key={i} className="flex gap-4 p-6 bg-white rounded-xl border border-border">
                  <div className="shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <span className="text-accent font-bold">{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-primary mb-2">{step.name}</h3>
                    <p className="text-text-body text-sm">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Deliverables ── */}
      {service.itemList?.length > 0 && (
        <section id="deliver" className="py-16">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 font-heading">
                What We <span className="text-accent">Deliver</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {service.itemList.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-surface rounded-lg">
                    <CheckCircle className="w-5 h-5 text-accent shrink-0" />
                    <span className="text-text-body">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Terms ── */}
      {service.definedTerms?.length > 0 && (
        <section id="terms" className="py-16 bg-surface">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 font-heading">
                Key <span className="text-accent">Terms</span>
              </h2>
              <div className="space-y-4">
                {service.definedTerms.map((term, i) => (
                  <div key={i} className="p-6 bg-white rounded-xl border border-border">
                    <h3 className="font-bold text-primary mb-2">
                      <span className="text-accent">{term.name}</span>
                    </h3>
                    <p className="text-text-body">{term.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      {service.faqs?.length > 0 && (
        <section id="faq" className="py-16">
          <div className="container mx-auto max-w-7xl px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 text-center font-heading">
              Frequently Asked <span className="text-accent">Questions</span>
            </h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {service.faqs.map((faq, i) => (
                <div key={i} className="border border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full flex items-center justify-between p-6 bg-white hover:bg-surface transition-colors text-left"
                  >
                    <span className="font-semibold text-primary pr-4">{faq.question}</span>
                    {openFaq === i
                      ? <ChevronUp className="w-5 h-5 text-text-muted shrink-0" />
                      : <ChevronDown className="w-5 h-5 text-text-muted shrink-0" />
                    }
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-6 bg-surface">
                      <p className="text-text-body leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-16 bg-linear-to-br from-primary to-primary-light">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-4 font-heading">
              Ready to get started?
            </h2>
            <p className="text-white/80 mb-8 font-body">
              Let&apos;s discuss your project requirements and see how we can help you achieve your business goals.
            </p>
            <Link href="/contact-us">
              <button className="px-8 py-4 bg-accent text-white text-sm font-medium tracking-wider rounded-md hover:bg-accent-hover transition-colors">
                <span className="flex items-center justify-center">
                  Contact us today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Back ── */}
      <section className="py-8 bg-white border-t border-border">
        <div className="container mx-auto max-w-7xl px-4">
          <Link href="/services" className="inline-flex items-center text-accent hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all services
          </Link>
        </div>
      </section>
    </div>
  );
}
