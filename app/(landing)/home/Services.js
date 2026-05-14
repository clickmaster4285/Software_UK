'use client';

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  ArrowUpRight,
  ShieldCheck,
  Globe2,
  Smartphone,
  BrainCircuit,
  Palette,
  Database,
  Server,
  Sparkles,
} from 'lucide-react';
import { useRef } from 'react';
import Image from 'next/image';
import softwareimg from "@/public/assets/software development icon.png";
import webdevelopment from "@/public/assets/web-development.png";
import mobileapp from "@/public/assets/mobile-app-development.svg";
// Adjust these import paths to match your project structure
const imgEmail = '/ass';
const imgWeb = '/assets/service-web.png';
const imgMobile = '/assets/service-mobile.png';
const imgAi = '/assets/service-ai.png';
const imgDesign = '/assets/service-design.png';
const imgCloud = '/assets/service-cloud.png';
const imgInfra = '/assets/service-infra.png';
const imgEnterprise = '/assets/service-enterprise.png';

const services = [
  {
    title: 'Software Development',
    description: 'Custom software solutions tailored to your business needs.',
    Icon: ShieldCheck,
    AltIcon: Globe2,
    image: softwareimg,    tag: 'Threat Defense',
    span: 'wide',
  },
  {
    title: 'Web Development',
    description: 'Modern web applications with responsive design and seamless user experience.',
    Icon: Globe2,
    AltIcon: Server,
    image: webdevelopment,    tag: 'Perimeter',
  },
  {
    title: 'Mobile Development',
    description: 'Build secure and scalable mobile applications for iOS and Android.',
    Icon: Smartphone,
    AltIcon: ShieldCheck,
    image: mobileapp,    tag: 'Endpoint',
  },
  {
    title: 'AI Monitoring',
    description: 'AI-powered monitoring systems with predictive threat intelligence.',
    Icon: BrainCircuit,
    AltIcon: Database,
    image: imgAi,
    tag: 'Intelligence',
    span: 'tall',
  },
  {
    title: 'UI/UX Systems',
    description: 'Elegant digital experiences focused on usability and conversion.',
    Icon: Palette,
    AltIcon: Globe2,
    image: imgDesign,    tag: 'Design',
  },
  {
    title: 'Cloud Security',
    description: 'Secure cloud-native infrastructure with scalable DevOps workflows.',
    Icon: Database,
    AltIcon: Server,
    image: imgCloud,
    tag: 'DevSecOps',
  },
  {
    title: 'Machine Learning',
    description: 'Scalable infrastructure architecture with maximum uptime and reliability.',
    Icon: Server,
    AltIcon: BrainCircuit,
    image: imgInfra,    tag: 'Reliability',
  },
  {
    title: 'Enterprise Apps',
    description: 'Custom enterprise-grade applications built for automation and growth.',
    Icon: Database,
    AltIcon: Palette,
    image: imgEnterprise,
    tag: 'Platform',
  },
  {
    title: 'Testing & Auditing',
    description: 'Comprehensive testing and auditing services to ensure quality, security, and compliance.',
    Icon: Database,
    AltIcon: Palette,
    image: imgEnterprise,
    tag: 'Platform',
  },
  {
    title: 'Blockchain & Web3',
    description: 'Decentralized solutions, smart contracts, and Web3 integration for next‑gen applications.',
    Icon: Database,
    AltIcon: Palette,
    image: imgEnterprise,
    tag: 'Platform',
  },
];

const marqueeItems = [
  'ISO 27001',
  'SOC 2 Type II',
  'GDPR Ready',
  'Zero Trust',
  '24/7 SOC',
  'Pen-Tested',
  'AI Native',
  'Edge Deployed',
];

function ServiceCard({ service, index }) {
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 150, damping: 15 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 150, damping: 15 });
  const glowX = useTransform(mx, (v) => `${v * 100}%`);
  const glowY = useTransform(my, (v) => `${v * 100}%`);

  const handleMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };
  const handleLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  const { Icon, AltIcon } = service;
  const spanClass =
    service.span === 'wide'
      ? 'sm:col-span-2 xl:col-span-2'
      : service.span === 'tall'
        ? 'xl:row-span-2'
        : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: '-80px' }}
      className={spanClass}
      style={{ perspective: 1200 }}
    >
      <motion.a
        ref={ref}
        href="#"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={`group relative flex flex-col justify-between ${service.span === 'tall' ? 'h-full min-h-[560px]' : 'h-[460px]'
          } rounded-[32px] border border-foreground/5 bg-white/70 backdrop-blur-xl p-7 overflow-hidden shadow-[0_20px_60px_-25px_rgba(103,18,174,0.25)] transition-shadow duration-500 hover:shadow-[0_40px_100px_-25px_rgba(103,18,174,0.5)]`}
      >
        {/* Mouse-tracking glow */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: useMotionTemplate`radial-gradient(400px circle at ${glowX} ${glowY}, oklch(0.45 0.22 305 / 0.22), transparent 65%)`,
          }}
        />

        {/* Animated gradient blobs - using theme accent */}
        <div className="absolute -top-32 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-accent/40 to-accent/20 opacity-30 blur-3xl animate-float-slow" />
        <div className="absolute -bottom-32 -left-24 w-72 h-72 rounded-full bg-accent/20 blur-3xl animate-float-reverse" />

        {/* Dot pattern using accent color */}
        <div
          className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(var(--accent)_1px,transparent_1px)] [background-size:20px_20px]"
        />

        {/* Sweeping shine */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1400ms] ease-out bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />

        <div className="relative z-10 flex flex-col h-full" style={{ transform: 'translateZ(40px)' }}>
          {/* Top: tag + risk meter */}
          <div className="flex items-start justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-sm border border-foreground/5 text-xs font-medium tracking-wide text-accent">
              <Sparkles className="w-3 h-3" />
              {service.tag}
            </span>
           
          </div>

          {/* Center: 3D image with floating animation */}
          <div className="flex-1 flex items-center justify-center my-4 relative">
            {/* Soft glow under image */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 rounded-full bg-accent/30 blur-3xl group-hover:bg-accent/50 transition-colors duration-500" />
            </div>
            {/* Pulse rings */}
            <span className="absolute w-40 h-40 rounded-full border border-accent/30 animate-pulse-ring" />
            <span
              className="absolute w-40 h-40 rounded-full border border-accent/20 animate-pulse-ring"
              style={{ animationDelay: '1.2s' }}
            />
            {/* Orbiting alt icon */}
            <div className="absolute inset-0 animate-spin-slow opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-9 h-9 rounded-xl bg-white shadow-md border border-foreground/5 flex items-center justify-center text-accent">
                <AltIcon className="w-4 h-4" />
              </div>
            </div>
            {/* 3D image with Next.js Image */}
            <motion.div
              whileHover={{ rotate: [0, -4, 4, 0] }}
              transition={{ duration: 0.8 }}
              className="relative w-64 h-64"
              style={{ transform: 'translateZ(60px)' }}
            >
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="(max-width: 768px) 100vw, 176px"
                className="object-contain drop-shadow-[0_20px_30px_rgba(103,18,174,0.35)] animate-float-slow group-hover:scale-110 transition-transform duration-500"
              />
            </motion.div>
          </div>

          {/* Bottom: title + arrow */}
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors duration-300">
              {service.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {service.description}
            </p>
            <div className="mt-5 flex items-center justify-between">
              <span className="text-xs font-medium tracking-wider uppercase text-foreground/60 group-hover:text-accent transition-colors">
                Explore service
              </span>
              <div className="relative w-11 h-11 rounded-full bg-foreground text-background flex items-center justify-center overflow-hidden group-hover:bg-accent transition-colors duration-300">
                <ArrowUpRight className="w-5 h-5 absolute transition-all duration-300 group-hover:translate-x-6 group-hover:-translate-y-6" />
                <ArrowUpRight className="w-5 h-5 absolute -translate-x-6 translate-y-6 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0" />
              </div>
            </div>
          </div>
        </div>
      </motion.a>
    </motion.div>
  );
}

export default function Services() {
  return (
    <section className="relative py-28 bg-background overflow-hidden">
      {/* Ambient background using theme colors */}
      <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px] animate-float-slow" />
      <div className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px] animate-float-reverse" />

      <div className="relative w-full px-6 xl:px-12 max-w-[1600px] mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-foreground/5 shadow-sm text-xs tracking-[0.3em] uppercase text-accent">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Our Services
          </span>
          <h1 className="mt-6 text-5xl md:text-7xl xl:text-8xl font-bold text-foreground tracking-tight leading-[1.05] pb-2">
            What{' '}
            <span className="relative inline-block pb-2">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    'linear-gradient(135deg, oklch(0.45 0.22 305), oklch(0.62 0.2 340))',
                }}
              >
                we do
              </span>
              <motion.svg
                viewBox="0 0 300 12"
                className="absolute -bottom-1 left-0 w-full h-3"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1.4, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <motion.path
                  d="M2 8 Q 75 2, 150 6 T 298 5"
                  fill="none"
                  stroke="url(#grad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="grad" x1="0" x2="1">
                    <stop offset="0" stopColor="oklch(0.45 0.22 305)" />
                    <stop offset="1" stopColor="oklch(0.62 0.2 340)" />
                  </linearGradient>
                </defs>
              </motion.svg>
            </span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-muted-foreground">
            A complete arsenal of security, intelligence, and design services — engineered
            to keep your business resilient, fast, and ahead of the curve.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 auto-rows-[460px] gap-6">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>

        {/* Marquee credibility strip */}
        <div className="relative mt-20 py-6 overflow-hidden border-y border-foreground/10">
          <div className="flex gap-12 animate-marquee whitespace-nowrap w-max">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-foreground/50 text-sm font-medium tracking-[0.25em] uppercase"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                {item}
              </div>
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}