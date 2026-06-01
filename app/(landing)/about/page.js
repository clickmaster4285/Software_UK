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
      className="group p-8 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/20 hover:border-accent/30 transition-all duration-500 hover:bg-white/60"
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

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight font-heading">
              Building the Future of
              <span className="block text-accent">Digital Innovation</span>
            </h1>

            <p className="text-xl text-white max-w-3xl mx-auto mb-10 leading-relaxed">
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
      <section className="py-24 relative">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Our Journey
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-heading">
              From Vision to <span className="text-accent">Industry Leader</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A decade of innovation, growth, and transformative partnerships
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, i) => (
              <Milestone key={milestone.year} milestone={milestone} index={i} />
            ))}
          </div>
        </div>
      </section>

        <Services />

      {/* ── Values Section ── */}
      <section className="py-24 bg-surface relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto max-w-7xl px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-heading">
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
      <section className="py-24">
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