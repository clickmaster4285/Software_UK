// ExploreSection.tsx
'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import { mainServicesData, iconMap } from '@/data/main-services';
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

  const isServicePage = !!serviceData;

  const allLinks = isServicePage
    ? (serviceData.childServices && serviceData.childServices.length > 0
        ? serviceData.childServices.map((child) => ({
            href: child.url || child.href || `/${serviceData.slug}`,
            title: child.title,
            desc: child.description || '',
            ariaLabel: `Learn about ${child.title}`,
            icon: child.icon || 'Code2',
          }))
        : serviceData.subServices
          ? serviceData.subServices.map((subService) => ({
              href: `/${serviceData.slug}/${subService.slug}`,
              title: subService.title,
              desc: subService.description,
              ariaLabel: `Learn about ${subService.title}: ${subService.description}`,
              icon: subService.icon,
            }))
          : []
      )
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
      className="bg-transparent py-16 md:py-24 relative overflow-hidden"
      aria-labelledby="explore-heading"
    >
      <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mb-12 md:mb-14">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-label mb-4"
          >
            {isServicePage ? 'Capabilities' : 'Ecosystem'}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            id="explore-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4 tracking-tight"
          >
            {isServicePage ? `${serviceData.title} Services` : 'Explore Our Expertise'}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base md:text-lg text-muted-foreground font-body leading-relaxed"
          >
            {isServicePage
              ? `Core ${serviceData.title.toLowerCase()} capabilities for enterprise scale and performance.`
              : 'From cloud architecture to AI, how we build and scale technology for global brands.'
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
                    className="group flex flex-col h-full rounded-xl border border-border/80 bg-background p-6 transition-colors duration-200 hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                  >
                    <div className="mb-5 inline-flex items-center justify-center w-11 h-11 rounded-lg bg-surface group-hover:bg-accent/10 transition-colors">
                      <Icon
                        className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors"
                        strokeWidth={1.5}
                      />
                    </div>

                    <div className="grow">
                      <h3 className="text-lg font-heading font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground font-body text-sm leading-relaxed line-clamp-3">
                        {item.desc}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-border/60 flex items-center gap-2 text-sm font-medium text-accent">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
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
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="group flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-heading font-semibold hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              {showAll ? 'Show less' : `View all (${allLinks.length})`}
              <ArrowRight className={`w-4 h-4 transition-transform ${showAll ? '-rotate-90' : 'group-hover:translate-x-0.5'}`} />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
