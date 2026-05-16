'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Factory,
  Store,
  Briefcase,
  Heart,
  GraduationCap,
  Building2,
  ArrowRight,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRouter } from 'next/navigation';
import CountUp from 'react-countup';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Define TypeScript interfaces
const industries = [
  {
    icon: Factory,
    title: 'Manufacturing',
    description:
      'Custom ERP, MES, production planning, and inventory software. We build manufacturing software that integrates with your shop floor and supply chain.',
    features: ['ERP & MRP', 'Production Planning', 'Quality Control', 'Inventory Systems'],
    stats: '40%',
    statLabel: 'Efficiency Increase',
  },
  {
    icon: Store,
    title: 'Retail & eCommerce',
    description:
      'E-commerce platforms, POS systems, and omnichannel retail software. Custom web and mobile apps for online stores and in-store operations.',
    features: ['E-commerce Apps', 'POS Software', 'Inventory Sync', 'Customer Portals'],
    stats: '3.5x',
    statLabel: 'Sales Growth',
  },
  {
    icon: Briefcase,
    title: 'Professional Services',
    description:
      'Project management, time tracking, billing, and client portal software. Custom software for consultancies, agencies, and service firms.',
    features: ['Project Management', 'Time & Billing', 'Client Portals', 'Reporting'],
    stats: '60%',
    statLabel: 'Time Saved',
  },
  {
    icon: Heart,
    title: 'Healthcare',
    description:
      'Patient management, scheduling, EHR integrations, and compliant healthcare software. Secure, HIPAA-aware applications for clinics and hospitals.',
    features: ['Patient Management', 'Scheduling', 'EHR Integration', 'Telehealth'],
    stats: '99.9%',
    statLabel: 'Uptime',
  },
  {
    icon: GraduationCap,
    title: 'Education',
    description:
      'Learning management systems, student portals, and education software. Custom web and mobile apps for schools, universities, and ed-tech.',
    features: ['LMS', 'Student Portals', 'Course Management', 'Attendance'],
    stats: '50k+',
    statLabel: 'Students Served',
  },
  {
    icon: Building2,
    title: 'Real Estate',
    description:
      'Property management, listing platforms, and real estate software. Custom solutions for agents, developers, and property managers.',
    features: ['Property Management', 'Listing Platforms', 'Lease Management', 'Tenant Portals'],
    stats: '25k+',
    statLabel: 'Properties Managed',
  },
];

const stats = [
  { number: '150+', label: 'Projects Delivered' },
  { number: '12+', label: 'Industries Served' },
  { number: '99%', label: 'Client Satisfaction' },
];

export function IndustriesSection() {
  const router = useRouter();

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  const ctaRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Premium hover animation for cards (matching WhyChooseSection style)
  const handleCardHover = (index, isHovering) => {
    setHoveredIndex(isHovering ? index : null);
    // No GSAP animations needed - handled by Framer Motion
  };

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden bg-white font-sans">
      <div className=" relative z-10 mx-auto  px-4 lg:px:12">
        {/* Header Section */}
        <div ref={headerRef} className="text-center mb-10">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-px bg-primary mx-auto mb-8"
          />

          <motion.h2
            className="text-3xl md:text-4xl font-bold text-black mt-2"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Driving <span className="text-primary">Excellence</span>
          </motion.h2>

          <motion.p
            className="text-gray-700 max-w-2xl mx-auto text-base mt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Deep expertise meets technical excellence across every sector
          </motion.p>
        </div>

        {/* Industries Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry, index) => {
            const Icon = industry.icon;
            return (
              <motion.div
                key={industry.title}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className="relative cursor-pointer"
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 25px 35px -15px rgba(249,115,22,0.3)',
                  borderColor: 'rgb(249, 115, 22)',
                  transition: { duration: 0.3 },
                }}
                onMouseEnter={() => handleCardHover(index, true)}
                onMouseLeave={() => handleCardHover(index, false)}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Premium Card Design */}
                <div className="relative bg-white rounded-2xl p-6 border border-primary/10 shadow-[0_4px_20px_rgb(0,0,0,0.02)] h-full overflow-hidden group">
                  {/* Animated background that moves on hover (matching WhyChooseSection) */}
                  <motion.div
                    className="absolute inset-0 bg-linear-to-r from-primary/10 to-transparent"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />

                  {/* Icon with rotation on hover */}
                  <motion.div
                    className="card-icon relative mb-5 transform-gpu transition-transform duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-md scale-0 group-hover:scale-150 transition-transform duration-500" />
                      <div className="relative w-12 h-12 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-black/80" strokeWidth={1.5} />
                      </div>
                    </div>
                  </motion.div>

                  {/* Title */}
                  <h3 className="card-title text-xl font-bold text-black mb-2 relative z-10">
                    {industry.title}
                  </h3>

                  {/* Description */}
                  <p className="card-desc text-gray-700 text-sm leading-relaxed mb-4 relative z-10">
                    {industry.description}
                  </p>

                  {/* Features with staggered animation */}
                  <div className="card-features flex flex-wrap gap-2 mb-4 relative z-10">
                    {industry.features.map((feature, i) => (
                      <motion.span
                        key={feature}
                        className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded-full"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * i }}
                      >
                        {feature}
                      </motion.span>
                    ))}
                  </div>

                  {/* Stats with premium animation */}
                  <div className="card-stats pt-3 border-t border-primary/20 flex items-baseline justify-between relative z-10">
                    <div>
                      <motion.span
                        className="text-2xl font-bold text-primary block leading-none"
                        whileHover={{ scale: 1.05 }}
                      >
                        {industry.stats}
                      </motion.span>
                      <span className="text-xs uppercase tracking-wider text-gray-500">
                        {industry.statLabel}
                      </span>
                    </div>


                  </div>

                  {/* Corner Accent with rotation */}
                  <div className="absolute bottom-3 right-3 w-6 h-6">
                    <motion.div
                      className="w-full h-full border-b border-r border-primary"
                      animate={{
                        rotate: hoveredIndex === index ? 180 : 0,
                        opacity: hoveredIndex === index ? 0.3 : 0.1,
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div ref={ctaRef} className="mt-20">
          <motion.div
            className="relative bg-linear-to-br from-gray-50 to-primary/20 rounded-3xl p-12 overflow-hidden border border-primary/10"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Animated Pattern */}
            <motion.div
              className="absolute inset-0 opacity-5"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, #f97316 1px, transparent 0)`,
                backgroundSize: '30px 30px',
              }}
            />

            {/* Animated light sweep (matching WhyChooseSection) */}
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-transparent via-primary/10 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <motion.div
                className="w-12 h-px bg-primary mx-auto mb-8"
                animate={{
                  width: ['48px', '96px', '48px'],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              <h3 className="text-3xl md:text-4xl font-bold text-black mb-4">
                Ready to Transform Your Industry?
                <span className="font-bold block mt-2 text-primary">
                  Let's Build Something Extraordinary
                </span>
              </h3>

              <p className="text-gray-700 text-base leading-relaxed max-w-2xl mx-auto">
                Whether you're in manufacturing, healthcare, or retail, we have the expertise to
                build software that drives your business forward.
              </p>

              {/* Stats Row with premium hover */}
              <motion.div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-12 mt-8 pt-8 border-t border-primary/10">
                {stats.map((stat, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{
                      y: -5,
                      scale: 1.05,
                    }}
                    className="text-center cursor-default"
                  >
                    <motion.div
                      className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary"
                      animate={{
                        textShadow: [
                          '0 0 0 rgba(249,115,22,0)',
                          '0 0 10px rgba(249,115,22,0.3)',
                          '0 0 0 rgba(249,115,22,0)',
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: idx * 0.3,
                      }}
                    >
                      {stat.number}
                    </motion.div>
                    <div className="text-xs sm:text-sm uppercase tracking-wider text-gray-500 mt-1">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Premium CTA Button */}
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 10px 25px -5px rgba(249,115,22,0.4)',
                }}
                whileTap={{ scale: 0.98 }}
                className="mt-8 px-8 py-3 bg-black text-white text-sm font-medium tracking-wider rounded-md hover:bg-primary transition-all duration-300 relative overflow-hidden group"
                onClick={() => router.push('/contact-us')}
              >
                <span className="relative z-10">Discuss Your Project</span>
                <motion.div
                  className="absolute inset-0 bg-primary"
                  initial={{ x: '100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}