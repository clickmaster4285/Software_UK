"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Play, Pause, Star, ArrowRight } from "lucide-react";
import { useTestimonialList } from "@/hooks/useTestimonials";

const EASE = [0.22, 1, 0.36, 1];

function StarRating({ rating = 5 }) {
  return (
    <motion.div
      className="flex justify-center gap-0.5 mb-4"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? "fill-accent text-accent"
              : "fill-border text-border"
          }`}
          aria-hidden
        />
      ))}
    </motion.div>
  );
}

export function TestimonialCard({ testimonial, isActive }) {
  const initials = testimonial.authorName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article
      className={`relative mx-auto w-full max-w-sm px-2 py-4 transition-all duration-500 ${
        isActive ? "scale-100" : "scale-[0.97] opacity-85"
      }`}
    >
      <div
        className={`relative flex h-full min-h-72 flex-col rounded-2xl border bg-white p-6 md:p-8 text-center shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-all duration-500 ${
          isActive
            ? "border-accent/35 shadow-[0_12px_40px_rgba(0,0,0,0.1)]"
            : "border-border"
        }`}
      >
        <Quote
          className="mx-auto mb-3 h-7 w-7 text-accent/80"
          aria-hidden
        />

        <StarRating rating={testimonial.rating ?? 5} />

        <blockquote className="flex-1 text-sm md:text-base text-text-body font-body leading-relaxed">
          &ldquo;{testimonial.content}&rdquo;
        </blockquote>

        <footer className="mt-6 flex flex-col items-center gap-3 border-t border-border pt-6">
          {testimonial.avatarUrl ? (
            <motion.div
              className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-accent/20 shadow-md"
              whileHover={{ scale: 1.05 }}
            >
              <Image
                src={testimonial.avatarUrl}
                alt=""
                fill
                sizes="56px"
                className="object-cover"
                unoptimized
              />
            </motion.div>
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface border border-border font-heading text-sm font-bold text-primary">
              {initials}
            </div>
          )}
          <div>
            <p className="font-heading text-base font-semibold text-text-primary">
              {testimonial.authorName}
            </p>
            <p className="text-sm text-text-muted font-body">
              {[testimonial.authorRole, testimonial.authorCompany]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
        </footer>
      </div>
    </article>
  );
}

export function TestimonialsSection({ serviceTitle }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);
  const autoplayRef = useRef(null);

  const { data: testimonials = [], isLoading, error } = useTestimonialList();

  const activeTestimonials = testimonials.filter(
    (t) => t.isActive !== false
  );

  const total = activeTestimonials.length;

  const goTo = useCallback((idx, dir = 1) => {
    setDirection(dir);
    setActiveIndex(((idx % total) + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    goTo(activeIndex + 1, 1);
  }, [activeIndex, goTo]);

  const goPrev = useCallback(() => {
    goTo(activeIndex - 1, -1);
  }, [activeIndex, goTo]);

  // Autoplay
  useEffect(() => {
    if (!isAutoPlaying || total <= 1) return;
    autoplayRef.current = setInterval(goNext, 4500);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [isAutoPlaying, goNext, total]);

  // Pause on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  const headline = serviceTitle
    ? `Trusted for ${serviceTitle}`
    : "Trusted by growing businesses";

  if (isLoading) {
    return (
      <section className="relative bg-white py-20 md:py-28">
        <motion.div className="container">
          <div className="mx-auto max-w-xl text-center mb-12">
            <div className="h-4 w-32 bg-surface rounded-full animate-pulse mx-auto mb-4" />
            <motion.div className="h-10 w-64 bg-surface rounded-xl animate-pulse mx-auto" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-72 rounded-2xl border border-border bg-surface animate-pulse"
              />
            ))}
          </div>
        </motion.div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-16">
        <motion.p className="container text-center text-sm text-text-muted font-body">
          Testimonials are temporarily unavailable.{" "}
          <Link href="/testimonials" className="text-accent underline-offset-4 hover:underline">
            View our stories
          </Link>
        </motion.p>
      </section>
    );
  }

  if (total === 0) return null;

  // Determine which 3 cards to show (prev, current, next)
  const getVisibleIndices = () => {
    if (total <= 3) return Array.from({ length: total }, (_, i) => i);
    const prev = ((activeIndex - 1) % total + total) % total;
    const next = (activeIndex + 1) % total;
    return [prev, activeIndex, next];
  };

  const visibleIndices = getVisibleIndices();

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.95 }),
  };

  return (
    <section
      className="relative overflow-hidden bg-white py-20 md:py-28 font-sans"
      aria-labelledby="testimonials-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, color-mix(in oklch, var(--primary) 10%, transparent), transparent 65%)",
        }}
      />

      <motion.div className="container relative z-10">
        <motion.header
          className="text-center mb-12 md:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <span className="text-lg font-semibold text-accent font-body mb-2">
            Client Stories
          </span>

          <h2
            id="testimonials-heading"
            className="font-heading text-3xl font-bold tracking-tight text-text-primary sm:text-4xl"
          >
            {headline}
          </h2>
          <p className="mt-4 text-base text-text-body font-body leading-relaxed sm:text-lg">
            Real feedback from teams who shipped products with ClickMasters — on time,
            on budget, and built to scale.
          </p>

          <Link
            href="/testimonials"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover transition-colors font-body"
          >
            View all testimonials
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </motion.header>

        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Carousel track */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-7 items-stretch">
            {visibleIndices.map((idx, pos) => {
              const t = activeTestimonials[idx];
              const isCenter = idx === activeIndex;
              return (
                <div key={`${idx}-${t._id}`} className="flex justify-center">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={t._id}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.5, ease: EASE }}
                      className="w-full max-w-sm"
                    >
                      <TestimonialCard testimonial={t} isActive={isCenter} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Dot indicators */}
          {total > 3 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              {Array.from({ length: total }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > activeIndex ? 1 : -1);
                    setActiveIndex(i);
                    setIsAutoPlaying(false);
                  }}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? "w-6 bg-accent"
                      : "w-2 bg-border hover:bg-accent/40"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Controls */}
          <motion.div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                goPrev();
                setIsAutoPlaying(false);
              }}
              aria-label="Previous testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-primary shadow-sm transition hover:border-accent/40 hover:bg-surface"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>

            <button
              type="button"
              onClick={() => setIsAutoPlaying((v) => !v)}
              aria-label={isAutoPlaying ? "Pause carousel" : "Play carousel"}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-md transition hover:bg-accent-hover hover:scale-105"
            >
              {isAutoPlaying ? (
                <Pause className="h-4 w-4" aria-hidden />
              ) : (
                <Play className="h-4 w-4 ml-0.5" aria-hidden />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                goNext();
                setIsAutoPlaying(false);
              }}
              aria-label="Next testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-primary shadow-sm transition hover:border-accent/40 hover:bg-surface"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
