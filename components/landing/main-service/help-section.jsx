'use client';

import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  MessageCircle,
  Video,
  FileQuestion,
  Headphones,
  Search,
  ArrowRight,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Define types
// YOUR ORIGINAL CONTENT - NOT CHANGED
const helpResources = [
  {
    icon: BookOpen,
    title: 'Documentation',
    description: 'Technical documentation and developer guides for our software and APIs.',
    stat: '150+',
    color: 'from-primary to primary/80',
  },
  {
    icon: Video,
    title: 'Video Tutorials',
    description: 'Step-by-step videos to get started with your software and features.',
    stat: '200+',
    color: 'from-primary to primary/80',
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description:
      'Chat with our support team in real-time. Get help with development and technical questions.',
    stat: '24/7',
    color: 'from-primary to primary/80',
  },
  {
    icon: FileQuestion,
    title: 'FAQ',
    description: 'Common questions about our software development services, pricing, and process.',
    stat: '50+',
    color: 'from-primary to primary/80',
  },
  {
    icon: Headphones,
    title: 'Contact Support',
    description:
      'Request a callback or submit a ticket. Our development team responds within 24 hours.',
    stat: '24h',
    color: 'from-primary to primary/80',
  },
];

export function HelpSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const searchRef = useRef(null);
  const cardsRef = useRef([]);
  const ctaRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Clean hover animation for cards
  const handleCardHover = (index, isHovering) => {
    setHoveredIndex(isHovering ? index : null);

    const card = cardsRef.current[index];
    if (!card) return;

    if (isHovering) {
      gsap.to(card, {
        y: -8,
        scale: 1.05, 
        boxShadow: '0 20px 40px -12px rgba(0,0,0,0.1)',
        borderColor: 'rgba(249,115,22,0.3)',
        duration: 0.3,
        ease: 'power2.out',
      });
    } else {
      gsap.to(card, {
        y: 0,
        scale: 1, 
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
        borderColor: 'rgba(249,115,22,0.1)',
        duration: 0.4,
        ease: 'power3.out',
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="help"
      className="relative py-24 overflow-hidden bg-white font-sans lg:px-12"
    >
      <div className="relative z-10 mx-auto px-4 lg:px-12">
        
        {/* Header Section - Matching FAQ Style */}
        <div ref={headerRef} className="mx-auto max-w-3xl text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-0.5 w-8 rounded-full bg-accent" />
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
              Resources & Support
            </p>
            <span className="h-0.5 w-8 rounded-full bg-accent" />
          </div>

          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
            Resources & <span className="text-primary">Developer Support</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Documentation, tutorials, and technical support for your software. Need a custom
            solution? Get in touch with our development team.
          </p>
        </div>

        {/* Resources Grid - Width matched to FAQ (3 cols on lg, 4 on xl) */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3  mx-auto">
          {helpResources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <div
                key={resource.title}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                onMouseEnter={() => handleCardHover(index, true)}
                onMouseLeave={() => handleCardHover(index, false)}
                className="group relative cursor-pointer"
              >
                {/* Premium Card Design */}
                <div className="relative bg-white rounded-2xl p-6 border border-accent/10 shadow-[0_4px_20px_rgb(0,0,0,0.02)] h-full overflow-hidden transition-all duration-300">
                  
                  {/* Header with Icon and Stat */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <div className="relative w-12 h-12 flex items-center justify-center bg-gray-50 rounded-xl group-hover:bg-accent/5 transition-colors duration-300">
                        <Icon className="w-6 h-6 text-black/70 group-hover:text-primary transition-colors duration-300" strokeWidth={1.5} />
                      </div>
                    </div>

                    {resource.stat && (
                      <div className="text-right">
                        <p className="text-2xl font-bold text-black group-hover:text-primary transition-colors duration-300">{resource.stat}</p>
                        <p className="text-xs uppercase tracking-wider text-gray-500">Resourcessss</p>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-black mb-2 group-hover:text-primary transition-colors duration-300">
                    {resource.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {resource.description}
                  </p>

                  {/* Bottom Corner Accent */}
                  <div className="absolute bottom-3 right-3 w-6 h-6">
                    <motion.div
                      className="w-full h-full border-b border-r border-accent/20 group-hover:border-primary transition-all duration-300"
                      animate={{
                        rotate: hoveredIndex === index ? 90 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

    
      </div>
    </section>
  );
}

export default HelpSection;