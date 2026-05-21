// components/landingPage/servicesPage/TestimonialsSection.tsx
"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTestimonialList } from "@/hooks/useTestimonials";
import { motion, AnimatePresence } from 'framer-motion';

export function TestimonialsSection({
  featuredOnly = true,
  limit = 9
}) {
  const [currentGroup, setCurrentGroup] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef(null);

  const {  data: allTestimonials = [], isLoading, error } = useTestimonialList({  });

  const testimonials = useMemo(() => {
    let filtered = [...allTestimonials];
    if (featuredOnly) {
      filtered = filtered.filter((t) => t.featured === true || t.isActive === true);
    }
    return limit ? filtered.slice(0, limit) : filtered;
  }, [allTestimonials, featuredOnly, limit]);

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
      <section id="testimonials" className="scroll-mt-24 py-12 sm:py-16 md:py-20 bg-slate-50">
        <div className=" mx-auto  ">
          <div className="flex items-center gap-3 mb-8 sm:mb-10">
            <div className="h-8 sm:h-10 w-1 " />
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
      <section id="testimonials" className="scroll-mt-24 py-12 sm:py-16 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-3 sm:mb-4">What Our Clients Say</h2>
          <p className="text-sm sm:text-base text-slate-500">No testimonials available yet.</p>
        </div>
      </section>
    );
  }

  const currentTestimonials = groupedTestimonials[currentGroup] || [];

  return (
    <section id="testimonials" className="scroll-mt-24  relative overflow-hidden">
      <div className=" mx-auto px-4  relative">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 sm:mb-10 md:mb-12">
          <div className="h-8 sm:h-10 w-1 rounded-full bg-gradient-to-b from-primary to-accent" />
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-3xl font-semibold tracking-tight text-slate-900">
              What Our Clients Say
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1 sm:mt-2">Real stories from founders and teams we’ve helped</p>
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
                    <div className="h-full bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-[0_2px_16px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-border hover:border-accent/20 transition-all duration-300 flex flex-col">
                      {/* Large Quote Icon */}
                      <Quote className="h-8 w-8 sm:h-10 sm:w-10 text-accent/25 mb-4 sm:mb-6" />

                      <p className="text-sm sm:text-base md:text-lg leading-relaxed text-slate-700 flex-1">
                        “{testimonial.content}”
                      </p>

                      {/* Rating */}
                      {testimonial.rating && (
                        <div className="flex gap-0.5 sm:gap-1 mt-4 sm:mt-6 mb-4 sm:mb-6">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors ${
                                i <= testimonial.rating
                                  ? 'fill-accent text-accent'
                                  : 'text-border'
                              }`}
                            />
                          ))}
                        </div>
                      )}

                      {/* Author */}
                      <div className="flex items-center gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-slate-100 mt-auto">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary via-primary-mid to-primary-light flex items-center justify-center text-white font-semibold text-base sm:text-xl shadow-inner">
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
                  className="p-2 sm:p-3 rounded-full bg-white border border-border shadow-md hover:shadow-xl hover:border-accent/40 hover:text-accent transition-all duration-300 cursor-pointer"
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
                      className={`h-2 sm:h-3 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === currentGroup 
                          ? 'bg-accent w-6 sm:w-10' 
                          : 'bg-slate-300 hover:bg-slate-400 w-2 sm:w-3'
                      }`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={handleNext}
                  className="p-2 sm:p-3 rounded-full bg-white border border-border shadow-md hover:shadow-xl hover:border-accent/40 hover:text-accent transition-all duration-300 cursor-pointer"
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