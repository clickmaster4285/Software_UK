"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  ChevronRight,
  Lightbulb,
  Code2,
  Rocket,
  ShieldCheck,
  RefreshCw,
  Users,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import ExpandOnHover from "@/components/ui/expand-cards";

export default function ProcessPage() {
  const metricsRef = useRef(null);
  const ctaRef = useRef(null);
  const expandSectionRef = useRef(null);

  const metricsInView = useInView(metricsRef, { once: true });
  const ctaInView = useInView(ctaRef, { once: true });
  const expandInView = useInView(expandSectionRef, { once: true });

  const phases = [
    {
      step: "01",
      title: "Discovery & Strategy",
      icon: Lightbulb,
      color: "from-primary to-orange-600",
      bgLight: "bg-amber-50",
      description: "We align technology with business goals through deep discovery sessions, market analysis, and technical blueprinting.",
      deliverables: ["Requirements specification", "Technical architecture design", "Roadmap & sprint planning", "Risk assessment matrix"],
      duration: "1-2 weeks",
    },
    {
      step: "02",
      title: "UX/UI Design",
      icon: Users,
      color: "from-purple-500 to-indigo-600",
      bgLight: "bg-purple-50",
      description: "User-centered design that balances aesthetics with functionality. Wireframes to high-fidelity prototypes.",
      deliverables: ["User flow diagrams", "Interactive prototypes", "Design system & components", "Accessibility compliance"],
      duration: "2-4 weeks",
    },
    {
      step: "03",
      title: "Agile Development",
      icon: Code2,
      color: "from-blue-500 to-cyan-600",
      bgLight: "bg-blue-50",
      description: "Sprint-based engineering with continuous integration, code reviews, and test-driven development.",
      deliverables: ["Working software every sprint", "API documentation", "Unit & integration tests", "Code quality reports"],
      duration: "8-20 weeks",
    },
    {
      step: "04",
      title: "QA & Security",
      icon: ShieldCheck,
      color: "from-red-500 to-rose-600",
      bgLight: "bg-red-50",
      description: "Rigorous quality assurance, penetration testing, and compliance validation before release.",
      deliverables: ["Automated test suites", "Security audit report", "Performance benchmarks", "Cross-browser validation"],
      duration: "1-3 weeks",
    },
    {
      step: "05",
      title: "Deployment & Launch",
      icon: Rocket,
      color: "from-green-500 to-orange-600",
      bgLight: "bg-green-50",
      description: "Zero-downtime deployment, infrastructure scaling, and launch orchestration.",
      deliverables: ["CI/CD pipeline setup", "Load balancing configuration", "Backup & disaster recovery", "Launch day support"],
      duration: "1 week",
    },
    {
      step: "06",
      title: "Growth & Iteration",
      icon: RefreshCw,
      color: "from-indigo-500 to-purple-600",
      bgLight: "bg-indigo-50",
      description: "Post-launch analytics, feature expansion, and continuous optimization based on real usage.",
      deliverables: ["Performance monitoring", "User analytics dashboard", "Quarterly roadmap updates", "24/7 support SLA"],
      duration: "Ongoing",
    },
  ];

  const metrics = [
    { value: 98, suffix: "%", label: "Projects delivered on time" },
    { value: 3.5, suffix: "x", label: "Avg. client revenue growth", isFloat: true },
    { value: 40, suffix: "%", label: "Faster time-to-market*" },
    { value: 100, suffix: "%", label: "IP ownership & transparency" },
  ];

  const allProcessImages = [
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=600&fit=crop",
  ];

  // Animated Counter Component
  const AnimatedCounter = ({ value, suffix, isFloat = false }) => {
    const [count, setCount] = useState(0);

    React.useEffect(() => {
      if (!metricsInView) return;
      
      let start = 0;
      const duration = 1800;
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
      <span className="font-bold text-orange-600">
        {isFloat ? count.toFixed(1) : Math.floor(count)}{suffix}
      </span>
    );
  };

  return (
    <main className="bg-gradient-to-b from-white to-slate-50 overflow-x-hidden">
      <section ref={expandSectionRef} className="py-6 lg:py-12 px-6 lg:px-8">
        <div className="mx-auto lg:px-10">
          {/* Header Section */}
          <div className="mx-auto max-w-3xl text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="h-[2px] w-8 rounded-full bg-orange-400" />
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-800">
                Visual Process Journey
              </p>
              <span className="h-[2px] w-8 rounded-full bg-orange-400" />
            </div>

            <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-4xl">
              See our development process in action
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Hover over each image to explore different stages of our software development lifecycle
            </p>
          </div>

          {/* Metrics Section */}
          <section ref={metricsRef} className="mb-16 px-6 lg:px-8">
            <div className="mx-auto ">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:mx-20">
                {metrics.map((metric, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    animate={metricsInView ? { opacity: 0, y: 0 } : {}}
                    transition={{ delay: idx * 0.1, duration: 0.6 }}
                    className="text-center p-6 transition-all duration-300 hover:scale-105"
                  >
                    <div className="text-5xl  font-bold text-primarymb-2">
                      <AnimatedCounter 
                        value={metric.value} 
                        suffix={metric.suffix} 
                        isFloat={metric.isFloat} 
                      />
                    </div>
                    <p className="text-gray-700 font-medium">{metric.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ExpandOnHover Component */}
          <div className=" overflow-hidden ">
            <ExpandOnHover
              images={allProcessImages}
              phases={phases}
              defaultExpandedIndex={3}
              containerHeight="28rem"
             
            
              onImageChange={(index, phase) => {
                console.log(`Viewing process stage ${index}: ${phase?.title}`);
              }}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section ref={ctaRef} className="py-24 px-6 lg:px-8 bg-slate-900 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            className="text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Ready to transform your <span className="text-orange-400">software vision</span> into reality?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg text-gray-300"
          >
            Join 200+ successful clients who trust our proven development process
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <button className="group inline-flex items-center gap-2 rounded-lg bg-primarypx-8 py-3 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:bg-primary hover:scale-105">
              Schedule a Free Consultation <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>
      </section> */}
    </main>
  );
}