"use client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import {  useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useTestimonialList } from "@/hooks/useTestimonials";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const TestimonialCard = ({
  testimonial,
  isActive,
}) => {
  const blobRadius =
    "70% 30% 70% 30% / 40% 60% 40% 60%";

  return (
    <div className="relative mx-auto w-full max-w-105 px-3 py-14">
      {/* Background Blob */}
      <div
        aria-hidden
        className={`absolute inset-x-2 inset-y-6 z-0 bg-primary transition-all duration-500 ${
          isActive
            ? "rotate-[-10deg] scale-[1.03]"
            : "rotate-[-8deg] opacity-90"
        }`}
        style={{ borderRadius: blobRadius }}
      />

      {/* Card */}
      <div
        className={`relative min-h-105 bg-card shadow-xl transition-all duration-500 ${
          isActive
            ? "scale-100 shadow-2xl"
            : "scale-95 opacity-90"
        }`}
        style={{ borderRadius: blobRadius }}
      >
        <div className="flex h-full flex-col items-center px-8 pb-14 pt-20 text-center">
          {/* Avatar */}
          <Avatar className="absolute -top-8 left-1/2 h-20 w-20 -translate-x-1/2 border-4 border-card shadow-md">
            <AvatarImage
              src={testimonial.avatarUrl}
              alt={testimonial.authorName}
            />
            <AvatarFallback>
              {testimonial.authorName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Name */}
          <h3 className="text-lg font-semibold text-foreground">
            {testimonial.authorName}
          </h3>

          {/* Role */}
          <p className="mb-5 text-sm text-muted-foreground">
            {testimonial.authorRole}
            {testimonial.authorRole &&
              testimonial.authorCompany &&
              ", "}
            {testimonial.authorCompany}
          </p>

          {/* Quote Icon */}
          <Quote className="mb-3 h-6 w-6 fill-primary text-primary" />

          {/* Content */}
          <p className="text-sm leading-7 text-muted-foreground">
            &quot;{testimonial.content}&quot;
          </p>
        </div>
      </div>
    </div>
  );
};


export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [swiperRef, setSwiperRef] = useState(null);
  const sectionRef = useRef(null);
  const headerInView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Fetch testimonials from API using organized hook
  const { data: testimonials = [], isLoading, error } = useTestimonialList();

  useEffect(() => {
    if (!swiperRef) return;
    if (isAutoPlaying) swiperRef.autoplay?.start();
    else swiperRef.autoplay?.stop();
  }, [isAutoPlaying, swiperRef]);

  // Show loading state
  if (isLoading) {
    return (
     <section className="relative overflow-visible bg-secondary/40 py-24">
        <div className="mx-auto  px-6 lg:px-22">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 mb-16">
            <div>
              <div className="h-8 w-32 bg-muted rounded animate-pulse mb-5" />
              <div className="h-12 w-64 bg-muted rounded animate-pulse" />
            </div>
            <div className="flex items-start md:justify-end">
              <div className="h-20 w-64 bg-muted rounded animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Handle error state
  if (error) {
    console.error("Error fetching testimonials:", error);
    return (
      <section className="relative overflow-hidden bg-secondary/40 py-24">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-red-500">Failed to load testimonials. Please try again later.</p>
        </div>
      </section>
    );
  }

  // Don't render if no testimonials
  if (testimonials.length === 0) return null;

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-linear-to-b from-white to-slate-50 py-24">
      <div className="mx-auto px-6 ">
        
           {/* Header original design */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="w-8 h-0.5 bg-primary rounded-full" />
          <p className="text-accent text-[11px] font-bold tracking-[0.2em] uppercase">
          Testimonial
          </p>
          <span className="w-8 h-0.5 bg-primary rounded-full" />
        </div>

        <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3">
            Hear What <span className="text-primary">Our Clients</span>{ " "}Say about Us
             
            
          </h3>
          
            <p className="text-gray-700 max-w-2xl mx-auto text-sm">
           Real stories from real clients who turned their ideas into successful digital products with us.
        </p>
      </div>

       
{/* Carousel */}
<div className="relative pt-16">

  <Swiper
    modules={[Navigation, Pagination, Autoplay]}
    onSwiper={setSwiperRef}
    onSlideChange={(s) => setActiveIndex(s.realIndex)}
    centeredSlides
    loop={testimonials.length >= 3}
    autoplay={
      isAutoPlaying
        ? { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }
        : false
    }
    speed={800}
    spaceBetween={-20}
    slidesPerView={1.1}
    breakpoints={{
      640: { slidesPerView: 1.6, spaceBetween: -10 },
      768: { slidesPerView: 2.2, spaceBetween: 0 },
      1024: { slidesPerView: 3, spaceBetween: 10 },
    }}
    className="px-4! py-6!"
  >
    {testimonials.map((t, i) => (
      <SwiperSlide key={t._id} className="h-auto!">
        <TestimonialCard testimonial={t} isActive={i === activeIndex} />
      </SwiperSlide>
    ))}
  </Swiper>

  {/* Controls (Prev + Play/Pause + Next) */}
  <div className="mt-8 flex items-center justify-center gap-4">

    {/* Prev */}
    <button
      onClick={() => {
        swiperRef?.slidePrev();
        setIsAutoPlaying(false);
      }}
      aria-label="Previous"
      className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-primary bg-card text-primary shadow-md transition hover:bg-primary hover:text-primary-foreground"
    >
      <ChevronLeft className="h-5 w-5" />
    </button>

    {/* Play/Pause */}
    <button
      onClick={() => setIsAutoPlaying((v) => !v)}
      className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:scale-110"
      aria-label={isAutoPlaying ? "Pause" : "Play"}
    >
      {isAutoPlaying ? (
        <Pause className="h-4 w-4" />
      ) : (
        <Play className="h-4 w-4" />
      )}
    </button>

    {/* Next */}
    <button
      onClick={() => {
        swiperRef?.slideNext();
        setIsAutoPlaying(false);
      }}
      aria-label="Next"
      className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-primary bg-card text-primary shadow-md transition hover:bg-primary hover:text-primary-foreground"
    >
      <ChevronRight className="h-5 w-5" />
    </button>

  </div>
</div>



      </div>
    </section>
  );
}