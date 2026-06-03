'use client'

import { useRef, useMemo, useState } from "react"
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { ArrowRight, Briefcase, Calendar, Tag, Target } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { resolveImageUrl } from '@/lib/utils'
import { cn } from "@/lib/utils";

const formattedDate = (date) => {
  if (!date) return null;
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const EASE = [0.22, 1, 0.36, 1];

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

export const ParallaxCaseStudiesSection = ({ caseStudies, isLoading }) => {
  const containerRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(4);

  // Transform case studies into sections with proper formatting
  const sections = useMemo(() => {
    if (!caseStudies) return [];
    return caseStudies.slice(0, visibleCount).map((study, index) => ({
      id: study._id,
      title: study.title,
      description: study.excerpt,
      imageUrl: study.thumbnail
        ? resolveImageUrl(study.thumbnail)
        : study.project?.thumbnail
          ? resolveImageUrl(study.project.thumbnail)
          : null,
      reverse: index % 2 !== 0,
      client: study.client,
      technologies: study.technologies || [],
      timeline: study.timeline,
      industry: study.industry,
      slug: study.slug || study._id,
      published: study.published,
      createdAt: study.createdAt
    }));
  }, [caseStudies, visibleCount]);

  // Use a single scrollYProgress for the entire section to control animations
  // This makes the animations more predictable and less dependent on individual section scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Smooth parallax effect for background blobs
  const blob1Y = useTransform(scrollYProgress, [0, 1], [-120, 120]);
  const blob2Y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <div ref={containerRef} className="relative overflow-hidden mx-auto max-w-[96vw] lg:max-w-[90vw]">
      {isLoading ? (
        <ParallaxSkeleton />
      ) : !caseStudies || !caseStudies.length ? (
        <EmptyState />
      ) : (
        <>
          {/* Background blobs */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
            <motion.div
              style={{ y: blob1Y }}
              className="absolute -top-16 left-1/4 h-64 w-64 rounded-full bg-accent/5 blur-[100px]"
            />
            <motion.div
              style={{ y: blob2Y }}
              className="absolute bottom-10 right-1/4 h-72 w-72 rounded-full bg-primary/5 blur-[110px]"
            />
          </div>

          {/* Parallax Sections */}
          <div className="flex flex-col">
            {sections.map((section, index) => (
              <CaseStudyParallaxItem
                key={section.id}
                section={section}
                index={index}
              />
            ))}
          </div>

          {/* Load More Button */}
          {caseStudies && caseStudies.length > visibleCount && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center py-8 sm:py-12"
            >
              <Button
                variant="outline"
                size="lg"
                onClick={() => setVisibleCount(prev => prev + 4)}
                className="group border-accent/20 hover:border-accent hover:bg-accent/5 text-slate-600 hover:text-accent rounded-xl px-8 transition-all duration-300 cursor-pointer"
              >
                Load More Success Stories
                <ArrowRight className="ml-2 h-4 w-4 rotate-90 transition-transform group-hover:translate-y-1" />
              </Button>
            </motion.div>
          )}

          {/* Minimal End Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={contentVariants}
            className='w-full flex flex-col items-center justify-center px-4 py-8 sm:py-12'
          >
            <motion.div className="text-center max-w-sm sm:max-w-md mx-auto">
              <h3 className='text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-4 px-4'>
                Ready for Your <span className="text-accent">Success Story?</span>
              </h3>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-accent to-accent-hover text-white hover:text-white rounded-lg px-6 sm:px-8 mt-3 w-full sm:w-auto font-semibold shadow-[0_2px_16px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                <Link href="/contact">
                  Start Project
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </>
      )}
    </div>
  );
};

const CaseStudyParallaxItem = ({ section, index }) => {
  const itemRef = useRef(null);
  const isInView = useInView(itemRef, { once: true, amount: 0.2 });

  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start end", "end start"]
  });

  // Subtle vertical movement for the image relative to scroll
  const imageY = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <div
      ref={itemRef}
      className={cn(
        "flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16 py-12 sm:py-20 md:py-28 px-4 sm:px-6 md:px-8 items-center",
        section.reverse ? 'lg:flex-row-reverse' : ''
      )}
    >
      {/* Content - Always on top for mobile */}
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.1, duration: 0.7, ease: EASE }
          }
        }}
        className="w-full lg:w-1/2 order-1 lg:order-none"
      >
        {/* Client Badge */}
        {section.client && (
          <motion.div variants={contentVariants} className="flex items-center gap-2 mb-2 sm:mb-3">
            <div className="w-6 h-0.5 rounded-full bg-accent" />
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.08em] text-accent">
              {section.client}
            </span>
          </motion.div>
        )}

        {/* Title */}
        <motion.h2
          variants={contentVariants}
          className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-2 sm:mb-3 leading-tight mt-4"
        >
          {section.title}
        </motion.h2>

        {/* Description */}
        <motion.p
          variants={contentVariants}
          className="text-slate-600 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4"
        >
          {section.description}
        </motion.p>

        {/* Metadata Grid - Responsive wrapping */}
        <motion.div
          variants={contentVariants}
          className="grid grid-cols-2 gap-x-4 gap-y-2 sm:gap-x-6 sm:gap-y-3 mb-3 sm:mb-4"
        >
          {section.industry && (
            <div className="flex items-center gap-1 sm:gap-1.5 text-xs text-slate-700">
              <Target className="h-3 w-3 text-accent flex-shrink-0" />
              <span className="truncate">{section.industry}</span>
            </div>
          )}
          {section.timeline && (
            <div className="flex items-center gap-1 sm:gap-1.5 text-xs text-slate-700">
              <Calendar className="h-3 w-3 text-accent flex-shrink-0" />
              <span className="truncate">{section.timeline}</span>
            </div>
          )}
          {formattedDate(section.createdAt) && (
            <div className="flex items-center gap-1 sm:gap-1.5 text-xs text-slate-700">
              <Calendar className="h-3 w-3 text-accent flex-shrink-0" />
              <span className="truncate">{formattedDate(section.createdAt)}</span>
            </div>
          )}
        </motion.div>

        {/* Technologies */}
        {section.technologies && section.technologies.length > 0 && (
          <motion.div
            variants={contentVariants}
            className="mb-3 sm:mb-4"
          >
            <div className="flex items-center gap-1 sm:gap-1.5 mb-1.5 sm:mb-2">
              <Tag className="h-3 w-3 text-accent flex-shrink-0" />
              <span className="text-[11px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">
                Core Tech Stack
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {section.technologies.slice(0, 3).map((tech, i) => (
                <span
                  key={i}
                  className="text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 font-medium"
                >
                  {tech}
                </span>
              ))}
              {section.technologies.length > 3 && (
                <span className="text-[11px] sm:text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  +{section.technologies.length - 3}
                </span>
              )}
            </div>
          </motion.div>
        )}

        <motion.div variants={contentVariants}>
          <Button
            asChild
            size="default"
            className="group bg-gradient-to-r from-accent to-accent-hover text-white hover:text-white rounded-lg px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base font-semibold shadow-[0_2px_16px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto cursor-pointer"
          >
            <Link href={`/case-studies/${encodeURIComponent(section.slug)}`}>
              Read more
              <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Image - Below content on mobile, then side by side on desktop */}
      <div className="w-full lg:w-1/2 order-2 lg:order-none mt-8 sm:mt-10 lg:mt-0">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0, scale: 0.95, y: 30 },
            visible: {
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { duration: 0.8, ease: EASE }
            }
          }}
          className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-border/30 group"
        >
          <motion.div style={{ y: imageY }} className="absolute inset-0 h-[120%] -top-[10%]">
            {section.imageUrl ? (
              <Image
                src={section.imageUrl}
                alt={section.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 50vw, 33vw"
                priority={index === 0}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-surface to-surface-2 flex items-center justify-center border border-border">
                <Briefcase className="h-12 w-12 sm:h-16 sm:w-16 text-text-muted" />
              </div>
            )}
          </motion.div>
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500 pointer-events-none" />
        </motion.div>
      </div>
    </div>
  );
};

// Mobile-friendly Skeleton Loader
const ParallaxSkeleton = () => (
  <div className="min-h-[50vh] sm:min-h-[60vh] flex flex-col items-center justify-center px-4">
    <div className="text-center w-full max-w-md mx-auto">
      <div className="h-8 w-32 bg-slate-200 rounded-full mx-auto mb-4 animate-pulse" />
      <div className="h-10 w-48 bg-slate-200 rounded-lg mx-auto animate-pulse" />
      <div className="mt-8 space-y-4">
        <div className="h-32 w-full bg-slate-100 rounded-xl animate-pulse" />
        <div className="h-20 w-full bg-slate-100 rounded-xl animate-pulse" />
      </div>
    </div>
  </div>
);

// Mobile-friendly Empty State
const EmptyState = () => (
  <div className="min-h-[40vh] sm:min-h-[50vh] flex flex-col items-center justify-center px-4">
    <div className="text-center max-w-sm mx-auto">
      <Briefcase className="h-10 w-10 sm:h-12 sm:w-12 text-slate-300 mx-auto mb-3" />
      <p className="text-slate-500 text-sm sm:text-base">No case studies available yet.</p>
      <p className="text-slate-400 text-xs sm:text-sm mt-2">Check back soon for success stories!</p>
    </div>
  </div>
);