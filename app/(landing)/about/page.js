'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { Suspense } from 'react';

// Import reusable components from main-service
import { TechStackSection } from '@/components/landing/main-service/TechStackSection';
import { TrustedClientsSection } from '@/components/landing/main-service/TrustedClientsSection';
import { FinalCTA } from '@/components/landing/main-service/finalCta';

// Import Services component (the clickable cards)
import Services from '@/app/(landing)/home/Services';
import { Button } from '@/components/ui/button';

// About page specific data
const stats = [
  { value: '200+', label: 'Projects Delivered' },
  { value: '50+', label: 'Enterprise Clients' },
  { value: '10+', label: 'Years Experience' },
  { value: '24/7', label: 'Support' },
  { value: '99.9%', label: 'Uptime Guarantee' },
];

const milestones = [
  { year: '2015', title: 'Founded', desc: 'Started with a vision to transform businesses through technology' },
  { year: '2018', title: 'First Enterprise Client', desc: 'Land our first Fortune 500 partnership' },
  { year: '2020', title: 'Global Expansion', desc: 'Opened offices in Europe and Asia' },
  { year: '2022', title: '100+ Projects', desc: 'Reached milestone of 100 successful projects' },
  { year: '2024', title: 'AI Innovation Award', desc: 'Recognized for excellence in AI solutions' },
  { year: '2025', title: '200+ Clients', desc: 'Serving over 200 clients worldwide' },
];

const values = [
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Agile Development",
    desc: "Sprint-based delivery with full transparency. We ship faster, iterate smarter, and keep you in control.",
    color: '#3b82f6',
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    title: "Scalable Architecture",
    desc: "Built on proven stacks — React, Node.js, and cloud-native infrastructure — engineered to scale without rewrites.",
    color: '#8b5cf6',
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Enterprise Security",
    desc: "Every product follows OWASP standards, GDPR best practices, and rigorous QA for your protection.",
    color: '#10b981',
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: "24/7 Dedicated Support",
    desc: "We stay with you post-launch — monitoring performance, deploying updates, resolving issues around the clock.",
    color: '#f59e0b',
  },
];

// Animated counter component
function StatCounter({ value, label, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className="text-4xl md:text-5xl font-bold text-foreground mb-2 font-heading">
        {value}
      </div>
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
    </motion.div>
  );
}

// Value card component
function ValueCard({ value, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group p-8 rounded-3xl bg-white/40 backdrop-blur-xl border border-black/20 hover:border-accent/30 transition-all duration-500 hover:bg-white/60"
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
        style={{ background: `linear-gradient(135deg, ${value.color}20, ${value.color}40)` }}
      >
        <div style={{ color: value.color }}>{value.icon}</div>
      </div>
      <h3 className="text-xl font-bold text-foreground mb-3 font-heading">{value.title}</h3>
      <p className="text-muted-foreground leading-relaxed">{value.desc}</p>
    </motion.div>
  );
}

// Milestone component
function Milestone({ milestone, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="flex gap-6"
    >
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-lg">
          {milestone.year.slice(-2)}
        </div>
        {index < milestones.length - 1 && (
          <div className="w-px h-24 bg-gradient-to-b from-accent/50 to-transparent mt-2" />
        )}
      </div>
      <div className="pb-12">
        <h4 className="text-lg font-bold text-foreground mb-1">{milestone.title}</h4>
        <p className="text-muted-foreground text-sm">{milestone.desc}</p>
      </div>
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background relative overflow-x-hidden">

      {/* ── Hero Section with Background Image ── */}
      <section className="relative min-h-[80vh] flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/aboutus.webp"
            alt="About ClickMasters"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto max-w-400 px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-400 mx-auto text-center"
          >
            {/* Breadcrumb */}
            <nav className="flex items-start justify-start gap-2 text-sm text-white mb-8">
              <Link href="/" className="hover:text-accent transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="font-medium">About Us</span>
            </nav>

            <h1 className="text-5xl xl:text-[4.7rem] font-bold mb-6 tracking-tight font-heading">

              {/* "Building the Future of" — crayon texture through the letters */}
              <span className="text-white block"
                // style={{
                //   backgroundImage: 'url(/assets/white-crayon-removebg-preview.png)',
                //   backgroundSize: 'contain',
                //   backgroundPosition: 'right',
                //   WebkitBackgroundClip: 'text',
                //   WebkitTextFillColor: 'transparent',
                //   backgroundClip: 'text',
                //   color: 'transparent',
                //   display: 'block',
                // }}
              >
                Building the Future of
              </span>

              {/* "Digital Innovation" — crayon image as solid background behind text */}
              <span className="text-accent"
                style={{
                  backgroundImage: 'url(/assets/white-crayon-removebg-preview.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'inline-block',
                  padding: '0.1em 0.4em',
                  borderRadius: '12px',
                  marginTop: '0.15em',
                }}
              >
                Digital Innovation
              </span>

            </h1>

            <p className="text-xl text-white max-w-4xl mx-auto mb-10 leading-relaxed">
              We craft powerful software solutions that help companies work smarter, scale faster, and achieve more — everywhere.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact-us">
                <Button className="px-8 py-5 bg-accent text-white font-medium rounded-xl hover:bg-accent-hover transition-colors flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/case-studies">
                <Button size="lg" variant="outline">
                  View Our Work
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ── Stats Section ── */}
      <section className="py-20 bg-surface relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto max-w-7xl px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {stats.map((stat, i) => (
              <StatCounter key={stat.label} value={stat.value} label={stat.label} index={i} />
            ))}
          </div>
        </div>
      </section>


      {/* ── Our Journey Section ── */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'oklch(0.99 0.005 250)' }}>

        {/* ── Animated wave background ── */}
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">

          {/* Drifting blobs */}
          <div className="blob-drift absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, oklch(0.5675 0.2072 318.97 / 0.18) 0%, transparent 70%)' }} />
          <div className="blob-drift absolute -bottom-32 -right-32 w-[450px] h-[450px] rounded-full opacity-25"
            style={{ background: 'radial-gradient(circle, oklch(0.5675 0.2072 318.97 / 0.14) 0%, transparent 70%)', animationDelay: '-6s' }} />

          {/* Wave 1 — slow, accent tint */}
          <svg className="wave-slow absolute bottom-0 left-0 w-full" style={{ height: '220px' }}
            viewBox="0 0 1440 220" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0,120 C240,180 480,60 720,120 C960,180 1200,60 1440,120 L1440,220 L0,220 Z"
              fill="oklch(0.5675 0.2072 318.97 / 0.06)"
            />
          </svg>

          {/* Wave 2 — mid speed, offset phase */}
          <svg className="wave-mid absolute bottom-0 left-0 w-full" style={{ height: '180px' }}
            viewBox="0 0 1440 180" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0,90 C360,150 720,30 1080,90 C1260,120 1380,60 1440,90 L1440,180 L0,180 Z"
              fill="oklch(0.5675 0.2072 318.97 / 0.05)"
            />
          </svg>

          {/* Wave 3 — fast, top accent sweep */}
          <svg className="wave-fast absolute top-0 left-0 w-full" style={{ height: '160px' }}
            viewBox="0 0 1440 160" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0,60 C180,100 360,20 540,60 C720,100 900,20 1080,60 C1260,100 1380,30 1440,60 L1440,0 L0,0 Z"
              fill="oklch(0.28 0.02 250 / 0.04)"
            />
          </svg>
        </div>

        <div className="container mx-auto max-w-7xl px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-accent text-xl font-medium mb-4">
              Our Journey
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-heading">
              From Vision to <span className="text-accent">Industry Leader</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A decade of innovation, growth, and transformative partnerships
            </p>
          </motion.div>

          {/* 3-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-10 items-start">

            {/* ── LEFT COLUMN ── */}
            <div className="flex flex-col gap-6">

              {/* Why We Started */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-border bg-white/60 backdrop-blur-sm p-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="text-accent"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                  </div>
                  <h3 className="font-bold text-foreground font-heading">Why We Started</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Founded on a simple belief — every business deserves software that actually works for them. We started to bridge the gap between enterprise-grade tech and growing businesses.
                </p>
              </motion.div>

              {/* Quick Facts */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-border bg-white/60 backdrop-blur-sm p-6 shadow-sm"
              >
                <h3 className="font-bold text-foreground font-heading mb-4">Quick Facts</h3>
                <ul className="space-y-3">
                  {[
                    { label: 'Headquarters', value: 'Islamabad, Pakistan' },
                    { label: 'Team Size', value: '50+ Engineers' },
                    { label: 'Avg. Project Duration', value: '3–6 Months' },
                    { label: 'Client Retention', value: '94%' },
                  ].map(f => (
                    <li key={f.label} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{f.label}</span>
                      <span className="font-semibold text-foreground">{f.value}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Industries Served */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-border bg-accent/5 p-6 shadow-sm"
              >
                <h3 className="font-bold text-foreground font-heading mb-4">Industries We Serve</h3>
                <div className="flex flex-wrap gap-2">
                  {['FinTech', 'Healthcare', 'Retail', 'Manufacturing', 'Education', 'Real Estate', 'Logistics', 'SaaS'].map(ind => (
                    <span key={ind} className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium border border-accent/20">
                      {ind}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* ── CENTRE — Timeline ── */}
            <div className="max-w-sm w-full mx-auto">
              {milestones.map((milestone, i) => (
                <Milestone key={milestone.year} milestone={milestone} index={i} />
              ))}
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="flex flex-col gap-6">

              {/* Live Metrics */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-border bg-white/60 backdrop-blur-sm p-6 shadow-sm"
              >
                <h3 className="font-bold text-foreground font-heading mb-4">At a Glance</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: '200+', label: 'Projects', color: '#3b82f6' },
                    { value: '50+', label: 'Clients', color: '#8b5cf6' },
                    { value: '10+', label: 'Years', color: '#10b981' },
                    { value: '99.9%', label: 'Uptime', color: '#f59e0b' },
                  ].map(m => (
                    <div key={m.label} className="rounded-xl p-4 text-center" style={{ background: `${m.color}12`, border: `1px solid ${m.color}30` }}>
                      <div className="text-2xl font-bold font-heading" style={{ color: m.color }}>{m.value}</div>
                      <div className="text-xs text-muted-foreground mt-1">{m.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Awards & Recognition */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-border bg-white/60 backdrop-blur-sm p-6 shadow-sm"
              >
                <h3 className="font-bold text-foreground font-heading mb-4">Recognition</h3>
                <ul className="space-y-3">
                  {[
                    { title: 'AI Innovation Award 2024', body: 'Excellence in enterprise AI solutions' },
                    { title: 'Top UK Software Dev 2023', body: 'Clutch Global Leaders ranking' },
                    { title: 'ISO 27001 Certified', body: 'Enterprise-grade security standards' },
                  ].map(a => (
                    <li key={a.title} className="flex gap-3 items-start">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{a.title}</p>
                        <p className="text-xs text-muted-foreground">{a.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* What's Next */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="rounded-2xl p-6 shadow-sm text-white"
                style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent) 100%' }}
              >
                <h3 className="font-bold font-heading mb-2">What&apos;s Next?</h3>
                <p className="text-sm opacity-90 leading-relaxed mb-4">
                  Expanding into AI-driven ERP solutions and opening new delivery hubs across Europe by 2026.
                </p>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  <span>Join us on the journey</span>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

        <Services />

      {/* ── Values Section ── */}
      <section className="py-20 bg-surface relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto max-w-400 px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-accent text-lg font-medium mb-4">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground font-heading">
              Values That Drive <span className="text-accent">Excellence</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide every project we deliver
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <ValueCard key={value.title} value={value} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack Section ── */}
      <section className="border-t border-2">
        <TechStackSection />
      </section>


      {/* ── Trusted Clients Section ── */}
      <Suspense fallback={<div className="h-64 animate-pulse bg-surface" />}>
        <TrustedClientsSection
          title="Trusted by Industry Leaders"
          subtitle="We partner with forward-thinking companies to deliver mission-critical solutions."
        />
      </Suspense>


      {/* ── CTA Section ── */}
      <FinalCTA />

    </main>
  );
}