"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Lightbulb,
  Code2,
  Rocket,
  ShieldCheck,
  RefreshCw,
  Users,
} from "lucide-react";
import ExpandOnHover from "@/components/ui/expand-cards";

const AnimatedCounter = ({ value, suffix, isFloat = false, metricsInView }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!metricsInView) return;
    
    let start = 0;
    const duration = 1500;
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(isFloat ? Math.round(start * 10) / 10 : Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, isFloat, metricsInView]);

  return (
    <span className="font-heading font-bold text-primary">
      {isFloat ? count.toFixed(1) : Math.floor(count)}{suffix}
    </span>
  );
};

export function ProcessPage({ serviceData }) {
  const metricsRef = useRef(null);
  const expandSectionRef = useRef(null);

  const metricsInView = useInView(metricsRef, { once: true });

  const defaultPhases = [
    {
      step: "01",
      title: "Discovery & Strategy",
      icon: Lightbulb,
      description: "We align technology with business goals through deep discovery sessions.",
    },
    {
      step: "02",
      title: "UX/UI Design",
      icon: Users,
      description: "User-centered design that balances aesthetics with functionality.",
    },
    {
      step: "03",
      title: "Agile Development",
      icon: Code2,
      description: "Sprint-based engineering with continuous integration and reviews.",
    },
    {
      step: "04",
      title: "QA & Security",
      icon: ShieldCheck,
      description: "Rigorous quality assurance and compliance validation before release.",
    },
    {
      step: "05",
      title: "Deployment",
      icon: Rocket,
      description: "Zero-downtime deployment and launch orchestration.",
    },
    {
      step: "06",
      title: "Growth",
      icon: RefreshCw,
      description: "Post-launch analytics and continuous optimization.",
    },
  ];

  // Map serviceData.lifecycle to phases
  const phases = serviceData?.lifecycle?.map((l, idx) => {
    const icons = [Lightbulb, Users, Code2, ShieldCheck, Rocket, RefreshCw];
    return {
      step: l.step || `0${idx + 1}`,
      title: l.title,
      description: l.description,
      icon: icons[idx % icons.length],
      color: "from-primary to-orange-600",
      bgLight: "bg-slate-50",
      deliverables: l.deliverables || ["Documentation", "Working Code", "QA Report"],
      duration: l.duration || "Flexible",
    };
  }) || defaultPhases;

  const metrics = serviceData?.stats?.map(s => ({
    value: parseFloat(s.value) || 0,
    suffix: s.value.includes('%') ? '%' : (s.value.includes('+') ? '+' : ''),
    label: s.label
  })) || [
    { value: 98, suffix: "%", label: "Projects delivered on time" },
    { value: 3.5, suffix: "x", label: "Avg. client revenue growth", isFloat: true },
    { value: 40, suffix: "%", label: "Faster time-to-market" },
    { value: 100, suffix: "%", label: "IP ownership" },
  ];

  const allProcessImages = [
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=600&fit=crop",
  ];

  return (
    <section className="bg-white py-24 font-sans overflow-hidden">
      <div ref={expandSectionRef} className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-0.5 w-8 rounded-full bg-primary" />
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Our Methodology
            </p>
            <span className="h-0.5 w-8 rounded-full bg-primary" />
          </div>

          <h2 className="mt-5 font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {serviceData?.title || 'Our'} Development Process
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 font-body sm:text-lg">
            We follow a proven, agile-driven approach to ensure every project is delivered with surgical precision and exceptional quality.
          </p>
        </div>

        {/* Metrics Section */}
        <div ref={metricsRef} className="mb-20">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 max-w-5xl mx-auto">
            {metrics.map((metric, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={metricsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="text-center group"
              >
                <div className="text-4xl md:text-5xl font-heading font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                  <AnimatedCounter 
                    value={metric.value} 
                    suffix={metric.suffix} 
                    isFloat={metric.isFloat || metric.value % 1 !== 0} 
                    metricsInView={metricsInView}
                  />
                </div>
                <p className="text-slate-500 font-body text-sm uppercase tracking-wide">{metric.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Expandable Process Journey */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-100 shadow-2xl">
          <ExpandOnHover
            images={allProcessImages}
            phases={phases}
            defaultExpandedIndex={0}
            containerHeight="32rem"
          />
        </div>
      </div>
    </section>
  );
}

export default ProcessPage;