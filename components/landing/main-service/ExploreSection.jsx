// ExploreSection.tsx
'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import { mainServicesData, slugify, iconMap } from '@/data/main-services';
import {
  ArrowRight,
  Code2
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export function ExploreSection({ serviceData }) {
  const [showAll, setShowAll] = useState(false);
  const sectionRef = useRef(null);

  // Scroll animation hooks
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  });

  const pathLength = smoothProgress;
  const opacity = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0, 0.4, 0.4, 0]);
  const secondaryPathLength = useTransform(smoothProgress, (v) => v * 1.1);
  const secondaryOpacity = useTransform(opacity, (v) => v * 0.4);

  const isServicePage = !!serviceData;

  const allLinks = isServicePage && serviceData.subServices
    ? serviceData.subServices.map((subService) => ({
      href: `/${serviceData.slug}/${slugify(subService.title)}`,
      title: subService.title,
      desc: subService.description,
      ariaLabel: `Learn about ${subService.title}: ${subService.description}`,
      icon: subService.icon,
    }))
    : Object.values(mainServicesData).map((service) => ({
      href: `/${service.slug}`,
      title: service.title,
      desc: service.description,
      ariaLabel: `Learn about ${service.title}: ${service.description}`,
      icon: service.icon,
    }));

  const displayedLinks = showAll ? allLinks : allLinks.slice(0, 12);
  const hasMoreItems = allLinks.length > 12;

  return (
    <section
      ref={sectionRef}
      className="bg-background py-20 relative overflow-hidden"
      aria-labelledby="explore-heading"
    >
      {/* Background Snake Line Animation */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M 5 0 C 15 20 40 10 50 40 C 60 70 85 60 95 100"
            stroke="var(--accent)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray="1 2"
            style={{ pathLength, opacity }}
          />
          <motion.path
            d="M 95 0 C 85 30 60 20 50 50 C 40 80 15 70 5 100"
            stroke="var(--primary)"
            strokeWidth="0.8"
            strokeLinecap="round"
            style={{ pathLength: secondaryPathLength, opacity: secondaryOpacity }}
          />
        </svg>
      </div>

      <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <span className="text-xl font-bold tracking-wide uppercase text-accent">
              {isServicePage ? 'Capabilities' : 'Ecosystem'}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            id="explore-heading"
            className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6"
          >
            {isServicePage ? `${serviceData.title} Services` : 'Explore Our Expertise'}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground font-body leading-relaxed"
          >
            {isServicePage
              ? `Deep-dive into our core ${serviceData.title.toLowerCase()} capabilities designed for enterprise scale and performance.`
              : 'From cloud architecture to AI implementation, discover how we build and scale modern technology solutions for global brands.'
            }
          </motion.p>
        </div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {displayedLinks.map((item, index) => {
              const Icon = iconMap[item.icon] || Code2;

              return (
                <motion.div
                  layout
                  key={`${item.href}-${index}`}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Link
                    href={item.href}
                    aria-label={item.ariaLabel}
                    className="group flex flex-col h-full bg-card rounded-3xl border border-border p-8 transition-all duration-500 hover:border-accent/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-2 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150" />

                    <div className="relative mb-8 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-surface group-hover:bg-accent/10 transition-colors duration-500">
                      <Icon
                        className="w-7 h-7 text-muted-foreground group-hover:text-accent transition-colors duration-500"
                        strokeWidth={1.5}
                      />
                    </div>

                    <div className="relative grow">
                      <h3 className="text-xl font-heading font-bold text-foreground mb-3 group-hover:text-accent transition-colors duration-500">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground font-body text-sm leading-relaxed line-clamp-3">
                        {item.desc}
                      </p>
                    </div>

                    <div className="relative mt-8 pt-6 border-t border-border flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                      <span className="text-sm font-bold text-accent tracking-wide">
                        EXPLORE SERVICE
                      </span>
                      <ArrowRight className="w-4 h-4 text-accent" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Show More / Show Less Button */}
        {hasMoreItems && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 flex justify-center"
          >
            <button
              onClick={() => setShowAll(!showAll)}
              className="group flex items-center gap-3 bg-primary text-primary-foreground px-10 py-4 rounded-2xl font-heading font-bold tracking-wide hover:bg-accent transition-all duration-300 shadow-xl shadow-primary/10"
            >
              {showAll ? 'SHOW LESS' : `VIEW ALL SERVICES (${allLinks.length})`}
              <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${showAll ? '-rotate-90' : 'group-hover:translate-x-1'}`} />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
