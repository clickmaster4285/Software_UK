// components/landingPage/servicesPage/TestimonialsSection.tsx
"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTestimonialList } from "@/hooks/useTestimonials";
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

export function TestimonialsSection({ featuredOnly = true, limit = 9 }) {
  const sectionRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  const { data: allTestimonials = [], isLoading, error } = useTestimonialList({});

  const testimonials = useMemo(() => {
    let filtered = [...allTestimonials];
    if (featuredOnly) {
      filtered = filtered.filter((t) => t.featured === true || t.isActive === true);
    }
    return limit ? filtered.slice(0, limit) : filtered;
  }, [allTestimonials, featuredOnly, limit]);

  // Check if ref is attached and we have data
  useEffect(() => {
    if (sectionRef.current && !isLoading && testimonials.length > 0) {
      setIsReady(true);
    } else {
      setIsReady(false);
    }
  }, [isLoading, testimonials.length]);

  // Only initialize scroll animations when ready
  const { scrollYProgress } = useScroll({
    target: isReady ? sectionRef : undefined,
    offset: ["start end", "end start"]
  });

  const blob1Y = useTransform(scrollYProgress, [0, 1], [-120, 120]);
  const blob2Y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const [currentGroup, setCurrentGroup] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef(null);

  const groupedTestimonials = useMemo(() => {
    const groups = [];
    for (let i = 0; i < testimonials.length; i += 3) {
      groups.push(testimonials.slice(i, i + 3));
    }
    return groups;
  }, [testimonials]);

  useEffect(() => {
    setCurrentGroup(0);
  }, [testimonials.length]);

  // Auto-play
  useEffect(() => {
    if (isAutoPlaying && groupedTestimonials.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentGroup((prev) => (prev + 1) % groupedTestimonials.length);
      }, 4800);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, groupedTestimonials.length]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentGroup((prev) => (prev - 1 + groupedTestimonials.length) % groupedTestimonials.length);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentGroup((prev) => (prev + 1) % groupedTestimonials.length);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (isLoading) {
    return (
      <section id="testimonials" className="mx-auto max-w-[96vw] lg:max-w-[90vw] scroll-mt-24 py-12 sm:py-16 md:py-20">
        <div className="mx-auto px-4">
          <div className="flex items-center gap-3 mb-8 sm:mb-10">
            <div className="h-8 sm:h-10 w-1 rounded-full bg-accent" />
            <h2 className="text-2xl sm:text-3xl md:text-3xl font-semibold tracking-tight text-slate-900">
              What Our Clients Say
            </h2>
          </div>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-pulse text-slate-400">Loading testimonials...</div>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section id="testimonials" className="scroll-mt-24 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-3 sm:mb-4">What Our Clients Say</h2>
          <p className="text-sm sm:text-base text-slate-500">No testimonials available yet.</p>
        </div>
      </section>
    );
  }

  const currentTestimonials = groupedTestimonials[currentGroup] || [];

  return (
    <section id="testimonials" ref={sectionRef} className="scroll-mt-24 mx-auto max-w-[96vw] lg:max-w-[90vw] relative overflow-hidden py-4 md:py-8">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <motion.div
          style={{ y: blob1Y }}
          className="absolute -top-16 left-1/4 h-64 w-64 rounded-full bg-accent/5 blur-25"
        />
        <motion.div
          style={{ y: blob2Y }}
          className="absolute bottom-10 right-1/4 h-72 w-72 rounded-full bg-primary/5 blur-[110px]"
        />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: "radial-gradient(var(--text-muted) 0.5px, transparent 0.5px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className=" mx-auto px-4  relative">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 sm:mb-10 md:mb-12">
          <div className="max-w-3xl">
            <p className="mb-3 inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-accent">
              Success Stories
            </p>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-10 w-1 shrink-0 rounded-full bg-accent" />
              <h2 className="font-heading text-2xl font-semibold leading-snug text-slate-900 sm:text-3xl">
                What Our <span className="text-accent">Clients Say</span>
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 mt-4">Real stories from founders and teams we’ve helped scale with custom software.</p>
          </div>
        </div>

        <div className="relative">
          {/* Testimonials Grid */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentGroup}
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -80 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8"
              >
                {currentTestimonials.map((testimonial, idx) => (
                  <motion.div
                    key={testimonial._id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="group"
                  >
                    <div className="relative h-full bg-white rounded-2xl p-6 sm:p-7 md:p-8 shadow-[0_2px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] border border-border hover:border-accent/25 transition-all duration-300 flex flex-col overflow-hidden">
                      <div className="absolute top-0 left-0 h-1 w-0 bg-linear-to-r from-accent to-accent-hover transition-all duration-500 group-hover:w-full" />

                      {/* Large Quote Icon */}
                      <Quote className="h-8 w-8 sm:h-10 sm:w-10 text-accent/20 mb-4 sm:mb-6" />

                      <p className="text-sm sm:text-base md:text-lg leading-relaxed text-slate-700 flex-1">
                        {testimonial.content}
                      </p>

                      {/* Rating */}
                      {testimonial.rating && (
                        <div className="flex gap-0.5 sm:gap-1 mt-4 sm:mt-6 mb-4 sm:mb-6">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors ${i <= testimonial.rating
                                ? 'fill-accent text-accent'
                                : 'text-border'
                                }`}
                            />
                          ))}
                        </div>
                      )}

                      {/* Author */}
                      <div className="flex items-center gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-slate-100 mt-auto">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-accent flex items-center justify-center text-white font-bold text-base sm:text-xl shadow-lg shadow-accent/20">
                          {testimonial.authorName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm sm:text-base md:text-lg group-hover:text-primary transition-colors">
                            {testimonial.authorName}
                          </p>
                          {(testimonial.authorRole || testimonial.authorCompany) && (
                            <p className="text-xs sm:text-sm text-slate-500">
                              {[testimonial.authorRole, testimonial.authorCompany]
                                .filter(Boolean)
                                .join(' • ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls at Bottom */}
          {groupedTestimonials.length > 1 && (
            <div className="flex flex-col items-center gap-4 sm:gap-6 mt-8 sm:mt-10 md:mt-12">
              {/* Arrows Row */}
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={handlePrevious}
                  className="p-2.5 sm:p-3 rounded-full bg-white border border-border shadow-sm hover:shadow-lg hover:border-accent/40 hover:text-accent transition-all duration-300 cursor-pointer"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-slate-700 hover:text-accent" />
                </button>

                {/* Dots */}
                <div className="flex gap-2 sm:gap-3">
                  {groupedTestimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setIsAutoPlaying(false);
                        setCurrentGroup(idx);
                        setTimeout(() => setIsAutoPlaying(true), 10000);
                      }}
                      className={`h-2 sm:h-3 rounded-full transition-all duration-300 cursor-pointer ${idx === currentGroup
                        ? 'bg-accent w-6 sm:w-10'
                        : 'bg-slate-300 hover:bg-slate-400 w-2 sm:w-3'
                        }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="p-2.5 sm:p-3 rounded-full bg-white border border-border shadow-sm hover:shadow-lg hover:border-accent/40 hover:text-accent transition-all duration-300 cursor-pointer"
                >
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-slate-700 hover:text-accent" />
                </button>
              </div>

              {/* Optional: Progress indicator */}
              <p className="text-xs sm:text-sm text-slate-400">
                {currentGroup + 1} of {groupedTestimonials.length}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}