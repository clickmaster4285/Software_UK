'use client';

import {
  BarChart3,
  Users,
  Trophy,
  Calendar,
  Cpu,
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const benefits = [
  {
    stat: "1,860+",
    label: "Projects Delivered",
    title: "Custom Software",
    description: "Tailored software built for your business. Web apps, desktop applications, and backend systems that scale.",
    icon: BarChart3,
    size: "large"
  },
  {
    stat: "3,500+",
    label: "Happy Clients",
    title: "Web Applications",
    description: "Modern web apps with React, Next.js, and cloud hosting. Responsive, fast, and secure.",
    icon: Users,
    size: "small"
  },
  {
    stat: "75+",
    label: "Industry Awards",
    title: "Mobile Solutions",
    description: "Native and cross-platform mobile apps for iOS and Android. From MVP to enterprise.",
    icon: Trophy,
    size: "small"
  },
  {
    stat: "5+",
    label: "Years Experience",
    title: "ERP & Automation",
    description: "ERP, CRM, and workflow automation. Integrate with your existing systems and processes.",
    icon: Calendar,
    size: "small"
  },
  {
    stat: "API",
    label: "Expertise",
    title: "API & Integrations",
    description: "REST APIs and legacy system modernization. Connect your software ecosystem seamlessly.",
    icon: Cpu,
    size: "large"
  },
  {
    stat: "24/7",
    label: "Reliability",
    title: "Maintenance & Support",
    description: "Ongoing updates and security patches. Keep your software running smoothly at all times.",
    icon: ShieldCheck,
    size: "small"
  },
];

export default function Benefits() {
  return (
    <section className="py-24 bg-surface relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-75 h-75 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-75 h-75 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-full lg:max-w-[90vw] mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-[11px] font-medium uppercase tracking-[0.08em] mb-4 border border-border">
            <span>Why ClickMasters</span>
          </div>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-primary mb-4 tracking-tight">
            High-Performance <span className="text-accent">Software Solutions</span>
          </h2>
          <p className="text-text-body font-body max-w-2xl mx-auto text-lg leading-relaxed">
            We combine technical excellence with strategic thinking to deliver software that drives real business growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`
                ${benefit.size === 'large' ? 'md:col-span-3' : 'md:col-span-2'}
                bg-white border border-border p-8 rounded-3xl relative group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500
              `}
            >
              <div className="flex justify-between items-start mb-8">
                <div className="p-3 bg-surface rounded-2xl group-hover:bg-accent/10 transition-colors duration-500">
                  <benefit.icon className="w-6 h-6 text-accent" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-heading font-bold text-4xl text-primary leading-none mb-1">
                    {benefit.stat}
                  </span>
                  <span className="text-text-muted text-xs font-medium uppercase tracking-wider">
                    {benefit.label}
                  </span>
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="font-heading font-bold text-xl text-primary mb-3 flex items-center gap-2">
                  {benefit.title}
                  <ArrowUpRight className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </h3>
                <p className="text-text-body font-body text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>

              {/* Decorative accent on hover */}
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-accent/5 rounded-br-3xl rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}

          {/* High Performance Decorative Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, rotateX: 5, rotateY: -5, rotateZ: 10 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            viewport={{ once: true }}
            className="absolute bottom-20 -right-12 md:-right-48 w-48 h-48 md:w-160 md:h-160 pointer-events-none z-20 hidden lg:block"
          >
            <div className="relative w-full h-full">
              <Image
                src="/landing/high-performace.webp"
                alt="High Performance"
                fill
                sizes="(max-width: 1024px) 0vw, 640px"
                className="object-contain"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

