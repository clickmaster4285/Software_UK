'use client'

import { useRef } from "react"
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, Briefcase, Calendar, Tag, Target } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { resolveImageUrl } from '@/lib/utils'
import { cn } from "@/lib/utils";

export const ParallaxCaseStudiesSection = ({ caseStudies, isLoading }) => {
  if (isLoading) {
    return <ParallaxSkeleton />;
  }

  if (!caseStudies.length) {
    return <EmptyState />;
  }

  // Transform case studies into sections with proper formatting
  const sections = caseStudies.slice(0,4).map((study, index) => ({
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

  // Create refs and animations for each section
  const sectionRefs = sections.map(() => useRef(null));
  
  const scrollYProgress = sections.map((_, index) => {
    return useScroll({
      target: sectionRefs[index],
      offset: ["start end", "center start"]
    }).scrollYProgress;
  });

  // Create animations for each section
  const opacityContents = scrollYProgress.map(progress => 
    useTransform(progress, [0, 0.7], [0, 1])
  );
  
  const clipProgresses = scrollYProgress.map(progress => 
    useTransform(progress, [0, 0.7], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"])
  );
  
  const translateContents = scrollYProgress.map(progress => 
    useTransform(progress, [0, 1], [-30, 0])
  );

  const translateImages = scrollYProgress.map(progress => 
    useTransform(progress, [0, 1], [30, 0])
  );

  const formattedDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="relative overflow-hidden">
    
      {/* Parallax Sections */}
      <div className="flex flex-col pb-6 sm:pb-8">
        {sections.map((section, index) => (
          <div 
            key={section.id}
            ref={sectionRefs[index]} 
            className={cn(
              "flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12 py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8",
              section.reverse ? 'lg:flex-row-reverse' : ''
            )}
          >
            {/* Content - Always on top for mobile */}
            <motion.div 
              style={{ y: translateContents[index] }}
              className="w-full lg:w-1/2 order-1 lg:order-none"
            >
              {/* Client Badge */}
              {section.client && (
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <div className="w-4 sm:w-6 h-px bg-accent" />
                  <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.08em] text-accent">
                    {section.client}
                  </span>
                </div>
              )}

              {/* Title */}
              <motion.h2 
                style={{ y: translateContents[index] }} 
                className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-2 sm:mb-3 leading-tight mt-4"
              >
                {section.title}
              </motion.h2>

              {/* Description */}
              <motion.p 
                style={{ y: translateContents[index] }} 
                className="text-slate-600 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4"
              >
                {section.description}
              </motion.p>

              {/* Metadata Grid - Responsive wrapping */}
              <motion.div 
                style={{ y: translateContents[index] }}
                className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4"
              >
                {section.industry && (
                  <div className="flex items-center gap-1 sm:gap-1.5 text-xs text-slate-600">
                    <Target className="h-3 w-3 text-primary flex-shrink-0" />
                    <span className="truncate">{section.industry}</span>
                  </div>
                )}
                {section.timeline && (
                  <div className="flex items-center gap-1 sm:gap-1.5 text-xs text-slate-600">
                    <Calendar className="h-3 w-3 text-primary flex-shrink-0" />
                    <span className="truncate">{section.timeline}</span>
                  </div>
                )}
                {formattedDate(section.createdAt) && (
                  <div className="flex items-center gap-1 sm:gap-1.5 text-xs text-slate-600">
                    <Calendar className="h-3 w-3 text-primary flex-shrink-0" />
                    <span className="truncate">{formattedDate(section.createdAt)}</span>
                  </div>
                )}
              </motion.div>

              {/* Technologies */}
              {section.technologies && section.technologies.length > 0 && (
                <motion.div 
                  style={{ y: translateContents[index] }}
                  className="mb-3 sm:mb-4"
                >
                  <div className="flex items-center gap-1 sm:gap-1.5 mb-1.5 sm:mb-2">
                    <Tag className="h-3 w-3 text-primary flex-shrink-0" />
                    <span className="text-[11px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Tech Stack
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {section.technologies.slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className="text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full bg-surface text-text-muted border border-border"
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

              <motion.div style={{ y: translateContents[index] }}>
                <Button
                  asChild
                  size="default"
                  className="group bg-gradient-to-r from-accent to-accent-hover text-white hover:text-white rounded-lg px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base font-semibold shadow-[0_2px_16px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto cursor-pointer"
                >
                  <Link href={`/case-studies/${encodeURIComponent(section.slug)}`}>
                    Read more
                    <ArrowDown className="ml-1.5 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 rotate-[-90deg]" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Image - Below content on mobile, then side by side on desktop */}
            <motion.div 
              style={{ 
                opacity: opacityContents[index],
                clipPath: clipProgresses[index],
                y: translateImages[index]
              }}
              className="w-full lg:w-1/2 order-2 lg:order-none mt-4 sm:mt-6 lg:mt-0"
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                {section.imageUrl ? (
                  <Image
                    src={section.imageUrl}
                    alt={section.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 50vw, 33vw"
                    priority={index === 0}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-surface to-surface-2 flex items-center justify-center border border-border">
                    <Briefcase className="h-12 w-12 sm:h-16 sm:w-16 text-text-muted" />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Minimal End Section */}
      <div className='w-full flex flex-col items-center justify-center px-4 py-8 sm:py-12'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-sm sm:max-w-md mx-auto"
        >
          <h3 className='text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-2 px-4'>
            Ready for Your Success Story?
          </h3>
          <Button 
            asChild 
            size="default" 
            className="bg-gradient-to-r from-accent to-accent-hover text-white hover:text-white rounded-lg px-6 sm:px-8 mt-3 w-full sm:w-auto font-semibold shadow-[0_2px_16px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            <Link href="/contact">
              Start Project
              <ArrowDown className="ml-1.5 h-3.5 w-3.5 rotate-[-90deg]" />
            </Link>
          </Button>
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