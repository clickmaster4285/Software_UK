'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Code,
  BookOpen,
  MessageCircle,
  Globe,
  Award,
  ArrowRight,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRouter } from 'next/navigation';
import CountUp from 'react-countup';
import { Card3DList, CardData } from '@/components/ui/animated-3d-card';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Define types
// YOUR ORIGINAL CONTENT - NOT CHANGED
const communityFeatures = [
  {
    icon: Code,
    title: 'Built for Real-World Impact',
    description:
      'We don’t just write code we build powerful software that solves real business problems and drives measurable growth.',
    stat: '1,860+',
    statLabel: 'Projects Delivered',
    color: 'from-primary/60 to-primary/10',
  },
  {
    icon: Users,
    title: 'Expert Development Team',
    description:
      'A skilled team of engineers, designers, and problem-solvers dedicated to turning your ideas into scalable digital products.',
    stat: '3,500+',
    statLabel: 'Happy Clients',
    color: 'from-primary/60 to-primary/10',
  },
  {
    icon: BookOpen,
    title: 'Fast & Agile Delivery',
    description:
      'We move fast without breaking things delivering high-quality software through agile, iterative development.',
    stat: '75+',
    statLabel: 'Successful Launches',
    color: 'from-primary/60 to-primary/10',
  },
  {
    icon: MessageCircle,
    title: 'Clear Communication',
    description:
      'No confusion, no delays just transparent updates and direct communication at every stage of your project.',
    stat: '5+',
    statLabel: 'Years Experience',
    color: 'from-primary/60 to-primary/10',
  },
  {
    icon: Globe,
    title: 'Modern Tech Stack',
    description:
      'We use cutting-edge technologies to build fast, secure, and future-ready applications that scale with your business.',
    stat: '24/7',
    statLabel: 'Support',
    color: 'from-primary/60 to-primary/10',
  },
  {
    icon: Award,
    title: 'Long-Term Partnership',
    description:
      'We don’t just deliver projects we stay with you for continuous improvement, updates, and long-term success.',
    stat: '100%',
    statLabel: 'Commitment',
    color: 'from-primary/60 to-primary/10',
  },
];

// YOUR ORIGINAL CONTENT - NOT CHANGED
const stats = [
  { value: '1,860+', label: 'Projects Delivered' },
  { value: '3,500+', label: 'Happy Clients' },
  { value: '75+', label: 'Industry Awards' },
];

// Helper function to extract number for counting
const extractNumber = (statString) => {
  const match = statString.match(/[\d,]+/);
  if (match) {
    return parseInt(match[0].replace(/,/g, ''), 10);
  }
  return 0;
};

// Helper function to check if stat has plus sign
const hasPlus = (statString) => {
  return statString.includes('+');
};

// Helper function to check if stat is percentage
const isPercentage = (statString) => {
  return statString.includes('%');
};

// Helper function to check if stat is 24/7 format
const is247 = (statString) => {
  return statString.includes('24/7');
};

function CommunityCountUpSpan({
  countStarted,
  start,
  countUpRef,
}) {
  useEffect(() => {
    if (countStarted) {
      start();
    }
  }, [countStarted, start]);
  return <span ref={countUpRef} />;
}

function CommunityFeatureCountUp({
  countStarted,
  numericValue,
  index,
  hasPlusSign,
  isPercent,
}) {
  return (
    <>
      <CountUp
        start={0}
        end={numericValue}
        duration={2.5}
        separator=","
        delay={0.2 + index * 0.1}
        useEasing={true}
        useGrouping={true}
      >
        {({ countUpRef, start }) => (
          <CommunityCountUpSpan countStarted={countStarted} start={start} countUpRef={countUpRef} />
        )}
      </CountUp>
      {hasPlusSign && <span className="text-primaryml-1">+</span>}
      {isPercent && <span className="text-primaryml-1">%</span>}
    </>
  );
}

export function CommunitySection() {
  const router = useRouter();

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const statsRef = useRef([]);
  const ctaRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [countStarted, setCountStarted] = useState(false);

  // Convert community features to CardData format for 3D cards


const cardsData = communityFeatures.map((feature, index) => ({
  id: feature.title.toLowerCase().replace(/\s+/g, '-'),
  title: feature.title,
  description: feature.description,
  icon: React.createElement(feature.icon, { className: "w-6 h-6" }),
  theme: "primary", // ← ALL cards use primary (black) theme
  onClick: () => router.push('/contact-us'),
}));

  // Premium GSAP animations (matching IndustriesSection style)
  useEffect(() => {
    if (!hasAnimated && sectionRef.current) {
      const ctx = gsap.context(() => {
        // Master timeline for coordinated entrance
        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger,
            start: 'top 70%',
            once,
            onEnter: () => {
              setHasAnimated(true);
              setCountStarted(true);
            },
          },
        });

        // Header animation
        if (headerRef.current) {
          masterTl.fromTo(
            headerRef.current,
            {
              opacity,
              y,
              scale,
            },
            {
              opacity,
              y,
              scale,
              duration,
              ease: 'power3.out',
            }
          );
        }

        // Animate stats cards
        statsRef.current.forEach((card, index) => {
          if (card) {
            masterTl.fromTo(
              card,
              {
                opacity,
                y,
                scale,
              },
              {
                opacity,
                y,
                scale,
                duration,
                ease: 'back.out(1.2)',
                delay: index * 0.1,
              },
              '-=0.4'
            );
          }
        });

        // CTA buttons entrance
        if (ctaRef.current) {
          masterTl.fromTo(
            ctaRef.current,
            {
              opacity,
              y,
              scale,
            },
            {
              opacity,
              y,
              scale,
              duration,
              ease: 'power3.out',
            },
            '-=0.2'
          );
        }
      }, sectionRef);

      return () => ctx.revert();
    }
  }, [hasAnimated]);

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden bg-white font-sans" id="community">
      <div className="relative z-10 mx-auto px-4 lg:px-12">
        
        {/* Header Section - Matching FAQ Style */}
        <div ref={headerRef} className="mx-auto max-w-3xl text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-[2px] w-8 rounded-full bg-orange-400" />
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-800">
              Why Choose Us
            </p>
            <span className="h-[2px] w-8 rounded-full bg-orange-400" />
          </div>

          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
            Why Choose Our Software Development Services
            
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            We deliver custom software, web apps, and mobile apps with experienced developers, agile
            process, and on-time delivery.
          </p>
        </div>

     

        {/* Animated 3D Cards Grid */}
        <div className="mb-20">
<Card3DList
  cards={cardsData}
  columns={3}
  gap="lg"
  size="md"
  variant="premium"
  animated={true}
/>
        </div>





           {/* Stats Row with Counters - matching IndustriesSection styling */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-12">
          {stats.map((stat, idx) => {
            const numericValue = parseInt(stat.value.replace(/\D/g, ''), 10) || 0;
            const hasPlusSign = stat.value.includes('+');

            return (
              <motion.div
                key={stat.label}
                ref={(el) => {
                  statsRef.current[idx] = el;
                }}
                className="relative text-center"
                whileHover={{
                  y: -5,
                  scale: 1.05,
                }}
              >
                <div className="relative bg-white/50 backdrop-blur-sm rounded-2xl p-6">
                  <motion.p
                    className="relative text-2xl sm:text-3xl md:text-4xl font-bold text-primary"
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
                    <span className="absolute inset-0 bg-orange-500/10 rounded-full blur-md -z-10" />
                    <CountUp
                      start={0}
                      end={numericValue}
                      duration={2.5}
                      separator=","
                      delay={0.2}
                      useEasing={true}
                      useGrouping={true}
                    />
                    {hasPlusSign && <span className="ml-1 text-primary">+</span>}
                  </motion.p>

                  <p className="text-xs sm:text-sm uppercase tracking-wider text-gray-500 mt-1">
                    {stat.label}
                  </p>

                  <div className="absolute bottom-0 left-1/2 h-px bg-orange-500/30 w-10 -translate-x-1/2" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Simple CTA Buttons - Get in Touch and Client Stories */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: '0 10px 25px -5px rgba(249,115,22,0.4)',
            }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 bg-primary text-white text-sm font-medium tracking-wider rounded-md hover:bg-primary transition-all duration-300 relative overflow-hidden group"
            onClick={() => router.push('/contact-us')}
          >
            <span className="relative z-10 flex items-center">
              Get in Touch
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
            <motion.div
              className="absolute inset-0 bg-primary"
              initial={{ x: '100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>

          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: '0 10px 25px -5px rgba(249,115,22,0.2)',
            }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 bg-transparent text-black text-sm font-medium tracking-wider border border-orange-200 hover:border-primary rounded-md transition-all duration-300 relative overflow-hidden group"
            onClick={() => router.push('/testimonials')}
          >
            <span className="relative z-10 flex items-center">
              Client Stories
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
            <motion.div
              className="absolute inset-0 bg-orange-50"
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </div>
      </div>
    </section>
  );
}