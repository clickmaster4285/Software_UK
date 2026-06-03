'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, Mail, Phone, MapPin, Clock, MessageSquare, Users, Zap, Shield } from 'lucide-react';
import { Suspense } from 'react';

// Import reusable components from main-service
import { FinalCTA } from '@/components/landing/main-service/finalCta';
import { Button } from '@/components/ui/button';
import ContactForm from './ContactForm';

// Contact page stats
const stats = [
  { value: '< 24h', label: 'Response Time', icon: Clock },
  { value: '200+', label: 'Projects Delivered', icon: Zap },
  { value: '50+', label: 'Enterprise Clients', icon: Users },
  { value: '99.9%', label: 'Uptime Guarantee', icon: Shield },
];

// Reasons to contact
const reasons = [
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Free Consultation',
    desc: 'Get a free 30-minute discovery call to discuss your project ideas and get expert recommendations.',
    color: '#3b82f6',
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'NDA Protected',
    desc: 'Every conversation is covered by a non-disclosure agreement. Your ideas stay completely confidential.',
    color: '#10b981',
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Fast Turnaround',
    desc: 'We respond within 24 hours and can often schedule calls the same day. No long waiting periods.',
    color: '#f59e0b',
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: 'Dedicated Support',
    desc: 'Get a dedicated project manager and direct access to our senior developers throughout your project.',
    color: '#8b5cf6',
  },
];

// Team members who help
const teamMembers = [
  {
    name: 'Sarah Mitchell',
    role: 'Head of Sales',
    image: '/contact/support-women.webp',
  },
  {
    name: 'James Wilson',
    role: 'Technical Lead',
    image: '/contact/support-person.webp',
  },
  {
    name: 'Our Support Team',
    role: 'Always Ready to Help',
    image: '/contact/support-team.webp',
  },
];

// Animated counter component
function StatCounter({ stat, index }) {
  const IconComponent = stat.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="text-center group"
    >
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
        <IconComponent className="w-8 h-8 text-accent" />
      </div>
      <div className="text-4xl md:text-5xl font-bold text-foreground mb-2 font-heading">
        {stat.value}
      </div>
      <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
    </motion.div>
  );
}

// Reason card component
function ReasonCard({ reason, index }) {
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
        style={{ background: `linear-gradient(135deg, ${reason.color}20, ${reason.color}40)` }}
      >
        <div style={{ color: reason.color }}>{reason.icon}</div>
      </div>
      <h3 className="text-xl font-bold text-foreground mb-3 font-heading">{reason.title}</h3>
      <p className="text-muted-foreground leading-relaxed">{reason.desc}</p>
    </motion.div>
  );
}

// Team card component
function TeamCard({ member, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group text-center"
    >
      <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-accent/20 group-hover:border-accent transition-colors">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover"
        />
      </div>
      <h3 className="text-lg font-bold text-foreground font-heading">{member.name}</h3>
      <p className="text-sm text-muted-foreground">{member.role}</p>
    </motion.div>
  );
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background relative overflow-x-hidden">

      {/* ── Hero Section with Background Image ── */}
      <section className="relative min-h-[75vh] flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/contact/contact-bg.webp"
            alt="Contact ClickMasters"
            fill
            priority
            className="object-cover"
          />
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto max-w-7xl px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center gap-2 text-sm text-white/80 mb-8">
              <Link href="/" className="hover:text-accent transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="font-medium text-white">Contact Us</span>
            </nav>

            <h1 className="text-5xl xl:text-[4.7rem] font-bold mb-6 tracking-tight font-heading">
              <span className="text-white">Let&apos;s Build Something</span>
              <span className="text-accent block mt-2">Great Together</span>
            </h1>

            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed">
              Ready to transform your business? Share your details — we&apos;ll respond within one business day with a personalized roadmap.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="#contact-form">
                <Button className="px-8 py-5 bg-accent text-white font-medium rounded-xl hover:bg-accent-hover transition-colors flex items-center gap-2">
                  Send us a Message
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="tel:+447988576086">
                <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white hover:border-white/50">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now
                </Button>
              </a>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <StatCounter key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact Form & Info Section ── */}
      <section id="contact-form" className="py-20 relative">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-accent text-xl font-medium mb-4">
              Get in Touch
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-heading">
              Send Us a <span className="text-accent">Message</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Fill out the form below and we&apos;ll get back to you within 24 hours
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="rounded-3xl bg-white/60 backdrop-blur-xl border border-black/20 p-8 md:p-10 shadow-xl"
            >
              <ContactForm />
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="rounded-3xl bg-white/60 backdrop-blur-xl border border-black/20 p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-foreground mb-6 font-heading">Contact Information</h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Phone</h4>
                      <a href="tel:+447988576086" className="text-muted-foreground hover:text-accent transition-colors">
                        +44 7988 576086
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Email</h4>
                      <a href="mailto:sale@clickmasterssoftwaredevelopmentcompany.co.uk" className="text-muted-foreground hover:text-accent transition-colors">
                        sale@clickmasterssoftwaredevelopmentcompany.co.uk
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Office</h4>
                      <p className="text-muted-foreground">
                        London, United Kingdom
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Business Hours</h4>
                      <p className="text-muted-foreground">
                        Monday - Friday: 9:00 AM - 6:00 PM<br />
                        Saturday - Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="rounded-3xl p-8 shadow-xl text-white"
                style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent) 100%)' }}>
                <h3 className="text-2xl font-bold font-heading mb-4">Need Immediate Help?</h3>
                <p className="opacity-90 leading-relaxed mb-6">
                  For urgent inquiries, call us directly. We&apos;re here to help you succeed.
                </p>
                <a href="tel:+447988576086">
                  <Button className="w-full bg-white text-accent hover:bg-white/90 font-semibold py-6">
                    <Phone className="w-5 h-5 mr-2" />
                    Call +44 7988 576086
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Why Contact Us Section ── */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'oklch(0.99 0.005 250)' }}>

        {/* Animated wave background */}
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
          <div className="blob-drift absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, oklch(0.5675 0.2072 318.97 / 0.18) 0%, transparent 70%)' }} />
          <div className="blob-drift absolute -bottom-32 -right-32 w-[450px] h-[450px] rounded-full opacity-25"
            style={{ background: 'radial-gradient(circle, oklch(0.5675 0.2072 318.97 / 0.14) 0%, transparent 70%)', animationDelay: '-6s' }} />

          <svg className="wave-slow absolute bottom-0 left-0 w-full" style={{ height: '220px' }}
            viewBox="0 0 1440 220" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0,120 C240,180 480,60 720,120 C960,180 1200,60 1440,120 L1440,220 L0,220 Z"
              fill="oklch(0.5675 0.2072 318.97 / 0.06)"
            />
          </svg>
        </div>

        <div className="container mx-auto max-w-[96vw] lg:max-w-[90vw] px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-accent text-xl font-medium mb-4">
              <MessageSquare className="w-5 h-5" />
              Why Contact Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-heading">
              We&apos;re Here to <span className="text-accent">Help You Succeed</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every interaction with ClickMasters is designed to give you confidence in your project
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reasons.map((reason, i) => (
              <ReasonCard key={reason.title} reason={reason} index={i} />
            ))}
          </div>
        </div>
      </section>


      {/* ── Meet Our Team Section ── */}
      <section className="py-20 border-t bg-surface relative overflow-hidden">
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
            <span className="inline-flex items-center gap-2 text-accent text-xl font-medium mb-4">
              <Users className="w-5 h-5" />
              Meet Our Team
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-heading">
              The People Who Will <span className="text-accent">Help You</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our dedicated team is ready to understand your needs and deliver solutions that exceed expectations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {teamMembers.map((member, i) => (
              <TeamCard key={member.name} member={member} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <FinalCTA />

    </main>
  );
}