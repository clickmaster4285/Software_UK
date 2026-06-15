'use client';

import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Factory,
  Store,
  Briefcase,
  Heart,
  GraduationCap,
  Building2,
  ArrowRight,
  ChevronRight,
  Globe2,
  Cpu
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const industries = [
  {
    icon: Factory,
    title: 'Manufacturing',
    description:
      'We build MES and ERP systems that digitize the factory floor. Our software integrates legacy hardware with modern cloud intelligence.',
    features: ['Real-time Monitoring', 'Predictive Maintenance', 'Supply Chain ERP'],
    stats: '40%',
    statLabel: 'Efficiency Increase',
    slug: 'manufacturing'
  },
  {
    icon: Store,
    title: 'Retail & eCommerce',
    description:
      'Omnichannel solutions that unify online and offline sales. High-performance eCommerce engines built for peak traffic stability.',
    features: ['Inventory Sync', 'Custom Checkout', 'Customer Insights'],
    stats: '3.5x',
    statLabel: 'Sales Growth',
    slug: 'retail'
  },
  {
    icon: Briefcase,
    title: 'Professional Services',
    description:
      'Scalable platforms for consulting and legal firms. Automate complex workflows and client interactions with enterprise portals.',
    features: ['Workflow Automation', 'Secure Client Portals', 'Resource ERP'],
    stats: '60%',
    statLabel: 'Operational ROI',
    slug: 'professional-services'
  },
  {
    icon: Heart,
    title: 'Healthcare',
    description:
      'Secure, HIPAA-ready applications for clinics and healthtech. We build patient-centric systems with robust data protection.',
    features: ['Patient Management', 'EHR Integration', 'Telehealth Systems'],
    stats: '99.9%',
    statLabel: 'System Uptime',
    slug: 'healthcare'
  },
  {
    icon: GraduationCap,
    title: 'EdTech & Learning',
    description:
      'Learning Management Systems (LMS) designed for engagement. We build portals that handle thousands of concurrent learners.',
    features: ['Custom LMS', 'Student Dashboards', 'Interactive Testing'],
    stats: '50k+',
    statLabel: 'Learners Served',
    slug: 'education'
  },
  {
    icon: Building2,
    title: 'Real Estate',
    description:
      'PropTech solutions for property management and development. Advanced listing platforms and tenant interaction systems.',
    features: ['Lease Management', 'Listing Engines', 'Tenant Portals'],
    stats: '25k+',
    statLabel: 'Assets Managed',
    slug: 'real-estate'
  },
];

const globalStats = [
  { number: '150+', label: 'Digital Products' },
  { number: '12+', label: 'Industry Sectors' },
  { number: '99%', label: 'Client Retention' },
];

export function IndustriesSection() {
  const router = useRouter();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const backgroundRotate = useTransform(scrollYProgress, [0, 1], [0, 10]);

  return (
    <section
      id="industries-expertise"
      ref={sectionRef}
      className="relative py-20 overflow-hidden bg-transparent"
      aria-labelledby="industries-heading"
    >
      {/* Premium Tech Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          style={{ rotate: backgroundRotate }}
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[110%] h-[140%] opacity-30 will-change-transform"
        >
          <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </motion.div>



        {/* Gradients */}
        <div className="absolute top-0 right-0 w-150 h-150 bg-accent/15 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-150 h-150 bg-primary/15 rounded-full blur-25 -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="mx-auto max-w-4xl text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/5 border border-accent/10 mb-6"
          >
            <Globe2 className="h-3.5 w-3.5 text-accent" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              Sector Specialization
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            id="industries-heading"
            className="font-heading text-4xl font-bold text-text-primary leading-tight mb-4"
          >
            Driving <span className="text-accent">Growth</span> Across Every Industry
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-priamry text-lg md:text-xl font-body leading-relaxed"
          >
            Our domain experts translate complex industry requirements into
            <span className="text-accent font-semibold"> high-performance digital products</span>.
          </motion.p>
        </div>

        {/* Industries Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {industries.map((industry, index) => {
            const Icon = industry.icon;
            const isHovered = hoveredIndex === index;

            return (
              <motion.div
                key={industry.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative cursor-pointer"
                aria-labelledby={`industry-title-${index}`}
              >
                {/* Premium Industry Card */}
                <div className="relative h-full bg-white rounded-[2rem] p-8 border border-border shadow-sm transition-all duration-500 group-hover:border-accent/30 group-hover:shadow-2xl group-hover:shadow-accent/5 overflow-hidden">

                  {/* Hover background layer */}
                  <div className="absolute inset-0 bg-linear-to-br from-accent/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Decorative number */}
                  <div className="absolute top-6 right-8 font-heading text-5xl font-black text-surface group-hover:text-accent/5 transition-colors duration-500 pointer-events-none">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div className="relative z-10">
                    {/* Icon Container */}
                    <motion.div
                      animate={{
                        scale: isHovered ? 1.1 : 1,
                        rotate: isHovered ? 5 : 0
                      }}
                      className="mb-8 relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface group-hover:bg-accent/10 transition-colors duration-500"
                    >
                      <Icon className="w-8 h-8 text-text-primary group-hover:text-accent transition-colors duration-500" strokeWidth={1.5} />
                    </motion.div>

                    <h3 id={`industry-title-${index}`} className="font-heading text-2xl font-bold text-text-primary mb-4 group-hover:text-accent transition-colors">
                      {industry.title}
                    </h3>

                    <p className="text-text-body text-sm leading-relaxed mb-8 font-body">
                      {industry.description}
                    </p>

                    {/* Features Chips */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {industry.features.map((feature) => (
                        <span
                          key={feature}
                          className="text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 bg-surface text-text-muted rounded-lg border border-border group-hover:border-accent/10 group-hover:text-text-primary transition-all"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Stats & Link */}
                    <div className="pt-6 border-t border-border flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-heading font-bold text-accent block leading-none">
                          {industry.stats}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted mt-1">
                          {industry.statLabel}
                        </span>
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface border border-border group-hover:bg-accent group-hover:border-accent transition-all duration-300">
                        <ChevronRight className="h-5 w-5 text-text-muted group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Interactive Industry CTA */}
        <div className="mt-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-primary rounded-[3rem] p-12 md:p-20 overflow-hidden shadow-3xl shadow-primary/20"
          >
            {/* Background elements */}
            <div className="absolute inset-0 bg-linear-to-br from-accent/20 to-transparent opacity-40 pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest mb-6">
                  <Cpu className="h-3 w-3" />
                  Engineering for Scale
                </div>
                <h3 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Ready to Lead Your <span className="text-accent">Industry?</span>
                </h3>
                <p className="text-white/70 text-lg font-body leading-relaxed mb-10 max-w-xl">
                  Whether you are digitizing legacy workflows or building a new market-disrupting product, our specialized engineering teams are ready to help you win.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button
                    asChild
                    className="btn-primary h-14 px-10 rounded-xl bg-accent text-white hover:bg-accent-hover shadow-xl shadow-accent/20 transition-all border-none"
                  >
                    <Link href="/contact">
                      Discuss Your Project
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {globalStats.map((stat, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <div className="text-3xl md:text-4xl font-heading font-bold text-accent mb-2">
                      {stat.number}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
