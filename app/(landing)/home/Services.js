'use client';

import Link from 'next/link';
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
import webdevelopment from "@/public/assets/web-development.webp";
import mobileapp from "@/public/assets/mobile-app-development.svg";

// New high-quality 3D image assets
const imgAi = '/landing/service-ai.png';
const imgDesign = '/landing/service_uiux.png';
const imgCloud = '/landing/service_cloudsecu.png';
const imgInfra = '/landing/service_machinelern.png';
const imgEnterprise = '/landing/service_enterpriceapp.png';
const imgTesting = '/landing/service_testing.png';

// Route mapping for clickable cards
const serviceRoutes = {
  'Software Development': '/software-development',
  'Web Development': '/web-development',
  'Mobile Development': '/mobile-development',
  'Artificial Intelligence': '/artificial-intelligence-ai',
  'UI/UX Systems': '/design-ui-ux',
  'Cloud & DevOps': '/cloud-and-devops',
  'Machine Learning': '/machine-learning-ml',
  'Data Services': '/data-services',
  'Testing & QA': '/testing-and-qa',
};

const services = [
  {
    title: 'Software Development',
    description: 'Custom software solutions tailored to your business needs.',
    Icon: ShieldCheck,
    AltIcon: Globe2,
    image: softwareimg,
    tag: 'Enterprise',
    span: 'wide',
    accent: '#3b82f6', // Blue
  },
  {
    title: 'Web Development',
    description: 'Modern web applications with responsive design and seamless user experience.',
    Icon: Globe2,
    AltIcon: Server,
    image: webdevelopment,
    tag: 'Web3 Ready',
    accent: '#ec4899', // Pink
  },
  {
    title: 'Mobile Development',
    description: 'Build secure and scalable mobile applications for iOS and Android.',
    Icon: Smartphone,
    AltIcon: ShieldCheck,
    image: mobileapp,
    tag: 'Cross-Platform',
    accent: '#10b981', // Green
  },
  {
    title: 'Artificial Intelligence',
    description: 'AI-powered monitoring systems with predictive threat intelligence.',
    Icon: BrainCircuit,
    AltIcon: Database,
    image: imgAi,
    tag: 'Intelligence',
    span: 'tall',
    accent: '#8b5cf6', // Purple
  },
  {
    title: 'UI/UX Systems',
    description: 'Elegant digital experiences focused on usability and conversion.',
    Icon: Palette,
    AltIcon: Globe2,
    image: imgDesign,
    tag: 'Design',
    accent: '#f59e0b', // Amber
  },
  {
    title: 'Cloud & DevOps',
    description: 'Secure cloud-native infrastructure with scalable DevOps workflows.',
    Icon: Database,
    AltIcon: Server,
    image: imgCloud,
    tag: 'DevSecOps',
    span: 'wide',
    accent: '#0ea5e9', // Sky
  },
  {
    title: 'Machine Learning',
    description: 'Scalable infrastructure architecture with maximum uptime and reliability.',
    Icon: Server,
    AltIcon: BrainCircuit,
    image: imgInfra,
    tag: 'Reliability',
    accent: '#14b8a6', // Teal
  },
  {
    title: 'Data Services',
    description: 'Data engineering, warehousing, and analytics solutions. ',
    Icon: Database,
    AltIcon: Palette,
    image: imgEnterprise,
    tag: 'Platform',
    accent: '#6366f1', // Indigo
  },
  {
    title: 'Testing & QA',
    description: 'Scalable infrastructure architecture with maximum uptime and reliability.',
    Icon: Database,
    AltIcon: Palette,
    image: imgTesting,
    tag: 'Platform',
    accent: '#42f560', // Red
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
  const rotateX = useSpring(useTransform(my, [0, 1], [10, -10]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-10, 10]), { stiffness: 100, damping: 30 });
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

  const { accent } = service;
  const spanClass =
    service.span === 'wide'
      ? 'sm:col-span-2'
      : service.span === 'tall'
        ? 'xl:row-span-2'
        : '';

  const route = serviceRoutes[service.title];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.21, 1, 0.44, 1] }}
      viewport={{ once: true, margin: '-50px' }}
      className={spanClass}
      style={{ perspective: 1000 }}
    >
    <Link href={route || '/services'}>
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          borderColor: `${accent}77`,
        }}
        className={`group relative flex flex-col justify-between cursor-pointer ${
          service.span === 'tall' ? 'h-full min-h-145' : 'h-115'
        } rounded-[40px] border bg-white/40 backdrop-blur-2xl p-8 overflow-hidden transition-all duration-500 hover:bg-white/60`}
      >
        {/* Hover Border Overlay */}
        <div 
          className="absolute inset-0 rounded-[40px] border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ borderColor: `${accent}66` }} // 40% opacity hover border
        />
        {/* Dynamic Accent Shadow */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            boxShadow: `0 30px 60px -15px ${accent}30`,
          }}
        />

        {/* Mouse-tracking glow */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: useMotionTemplate`radial-gradient(500px circle at ${glowX} ${glowY}, ${accent}15, transparent 70%)`,
          }}
        />

        {/* Background Decorative Blob */}
        <div 
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-all duration-700"
          style={{ background: accent }}
        />

        <div className="relative z-10 flex flex-col h-full" style={{ transform: 'translateZ(40px)' }}>
          {/* Top: Tag */}
          <div className="flex items-start justify-between">
            <span 
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/90 border border-white/50 shadow-sm text-[10px] font-bold tracking-widest uppercase"
              style={{ color: accent }}
            >
              <Sparkles className="w-3 h-3" />
              {service.tag}
            </span>
          </div>

          {/* Center: Image */}
          <div className="flex-1 flex items-center justify-center mb-6 relative">
            <div 
              className="absolute w-40 h-40 rounded-full blur-[60px] opacity-30 group-hover:opacity-50 transition-all duration-700"
              style={{ background: accent }}
            />
            
            <motion.div
              whileHover={{ 
                scale: 1.1,
                z: 80 
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="relative w-56 h-56"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="(max-width: 768px) 100vw, 224px"
                className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.1)] animate-float-slow transition-transform duration-500"
              />
            </motion.div>
          </div>

          {/* Bottom Content */}
          <div className='mb-6' style={{ transform: 'translateZ(20px)' }}>
            <h3 className="text-2xl font-bold text-foreground mb-2 tracking-tight">
              {service.title}
            </h3>
            <p className="text-sm text-muted-foreground/90 leading-relaxed line-clamp-2">
              {service.description}
            </p>
            
            <div className="mb-6 flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: accent }}>
                Learn More
              </span>
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:rotate-45"
                style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
              >
                <ArrowUpRight className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
    </motion.div>
  );
}

export default function Services() {
  return (
    <section className="relative py-20 bg-background overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/15 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/15 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-emerald-500/15 blur-[120px]" />
      </div>

      <div className="relative w-full px-6 xl:px-12 max-w-400 mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="mt-6 text-3xl md:text-5xl font-bold text-foreground tracking-tight">
            Innovating your{' '}
            <span className="text-accent">
              digital future
            </span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground/80 font-medium">
            We blend cutting-edge technology with world-class design to build products that define industries.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 auto-rows-[460px] gap-8">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>

        {/* Marquee Credibility */}
        {/* <div className="mt-32 pt-12 border-t border-white/10">
          <div className="flex gap-16 animate-marquee whitespace-nowrap w-max opacity-70 hover:grayscale-0 transition-all duration-500">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 text-foreground text-xs font-bold tracking-[0.2rem] uppercase"
              >
                <div className="w-2 h-2 rounded-full bg-accent" />
                {item}
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  );
}