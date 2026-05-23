"use client";

import "swiper/css";
import "swiper/css/effect-coverflow";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Play, Pause, Star, Sparkles, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
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
  const [swiperRef, setSwiperRef] = useState(null);

  const { data: testimonials = [], isLoading, error } = useTestimonialList();

  const activeTestimonials = testimonials.filter(
    (t) => t.isActive !== false
  );

  useEffect(() => {
    if (!swiperRef) return;
    if (isAutoPlaying) swiperRef.autoplay?.start();
    else swiperRef.autoplay?.stop();
  }, [isAutoPlaying, swiperRef]);

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

  if (activeTestimonials.length === 0) return null;

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
          className=" text-center mb-12 md:mb-14"
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

        <div className="relative">
          <Swiper
            modules={[Autoplay]}
            onSwiper={setSwiperRef}
            onSlideChange={(s) => setActiveIndex(s.realIndex)}
            centeredSlides
            loop={activeTestimonials.length >= 3}
            autoplay={
              isAutoPlaying
                ? { delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }
                : false
            }
            speed={700}
            spaceBetween={16}
            slidesPerView={1.05}
            breakpoints={{
              640: { slidesPerView: 1.4, spaceBetween: 20 },
              768: { slidesPerView: 2.1, spaceBetween: 24 },
              1024: { slidesPerView: 3, spaceBetween: 28 },
            }}
            className="!pb-2"
          >
            {activeTestimonials.map((t, i) => (
              <SwiperSlide key={t._id} className="!h-auto">
                <TestimonialCard testimonial={t} isActive={i === activeIndex} />
              </SwiperSlide>
            ))}
          </Swiper>

          <motion.div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                swiperRef?.slidePrev();
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
                swiperRef?.slideNext();
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
