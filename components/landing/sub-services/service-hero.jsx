"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Star,
  Award,
  Layers3,
  Users,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Counter Component with Animation
function Counter({
  targetValue,
  suffix = "",
  prefix = "",
}) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  const numericMatch = String(targetValue).match(/\d+/);
  const numericTarget = numericMatch ? parseInt(numericMatch[0], 10) : 0;
  const originalSuffix = String(targetValue).replace(/\d+/, "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let startTime;
    let animationFrame;
    const duration = 2000;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * numericTarget));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(numericTarget);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isVisible, numericTarget]);

  return (
    <div
      ref={elementRef}
      className="text-2xl sm:text-2xl lg:text-4xl xl:text-4xl font-bold text-white"
    >
      {prefix}
      {count}
      {suffix || originalSuffix}
    </div>
  );
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const CLIENT_AVATARS = [
  {
    src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=64&h=64&fit=crop&crop=faces",
    alt: "Business client portrait",
  },
  {
    src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=64&h=64&fit=crop&crop=faces",
    alt: "Business client portrait",
  },
  {
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=faces",
    alt: "Business client portrait",
  },
  {
    src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=64&h=64&fit=crop&crop=faces",
    alt: "Business client portrait",
  },
];

export function ServiceHero({ page }) {
  const controls = useAnimation();
  const sectionRef = useRef(null);
  const heroRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const isGoalPage = Boolean(page.parentService && page.currentPageLabel);
  const boldTerms =
    page.boldTerms?.filter(Boolean) ??
    (page.serviceName ? [page.serviceName] : []);

  // Helper function to emphasize key terms in text
  const makeBoldInText = (text, terms) => {
    if (!text || terms.length === 0) return text;

    const escaped = terms
      .filter(Boolean)
      .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    if (escaped.length === 0) return text;

    const regex = new RegExp(`(${escaped.join("|")})`, "gi");
    const split = text.split(regex);
    const lowerTerms = terms.map((t) => t.toLowerCase());

    return split.map((part, index) => {
      const isBold = terms.some((t) => part.toLowerCase() === t.toLowerCase());
      if (isBold) {
        return (
          <span key={index} className="font-semibold bg-white px-1 rounded-lg text-xl text-accent">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const breadcrumbCurrent = page.currentPageLabel ?? page.serviceName;

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [controls, isInView]);

  // Make navbar transparent using GSAP ScrollTrigger
  useEffect(() => {
    const navbar = document.getElementById("main-navbar");

    if (navbar && heroRef.current) {
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        onToggle: (self) => {
          if (self.isActive) {
            gsap.to(navbar, {
              backgroundColor: "transparent",
              backdropFilter: "blur(8px)",
              borderBottomColor: "rgba(255, 255, 255, 0.1)",
              duration: 0.3,
              ease: "power2.out",
            });
            const navLinks = navbar.querySelectorAll("a, button, span");
            navLinks.forEach((link) => {
              if (link.closest("nav")) {
                gsap.to(link, {
                  color: "white",
                  duration: 0.3,
                });
              }
            });
          } else {
            gsap.to(navbar, {
              backgroundColor: "white",
              backdropFilter: "blur(0px)",
              borderBottomColor: "rgb(229, 231, 235)",
              duration: 0.3,
              ease: "power2.out",
            });
            const navLinks = navbar.querySelectorAll("a, button, span");
            navLinks.forEach((link) => {
              if (link.closest("nav")) {
                gsap.to(link, {
                  color: "",
                  duration: 0.3,
                });
              }
            });
          }
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const stats = [
    { icon: Award, value: "8+", label: "Years Experience" },
    { icon: Layers3, value: "150+", label: "Projects Delivered" },
    { icon: Users, value: "98%", label: "Client Satisfaction" },
    { icon: Headphones, value: "24/7", label: "Support Available" },
  ];

  return (
    <div
      ref={heroRef}
      className="w-full  relative overflow-hidden bg-black/40 min-h-screen flex flex-col  "
    >
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/landing/sub-services/sub-service-bg.jpg"
          alt="Background"
          fill
          priority
          className="object-cover"
        />
        {/* Dark Overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/95 via-primary-mid/90 to-primary/95" />
      </div>

      {/* Breadcrumb */}
      <motion.div
        className="relative  z-10 border-b border-white/10 w-full px-6 pt-20"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className=" mx-auto max-w-[96vw] lg:max-w-[90vw] px-4 md:px-8 py-3.5">
          <nav className="flex items-center gap-1.5 text-sm">
            <Link
              href="/"
              className="text-slate-300 hover:text-accent transition-colors font-medium"
            >
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
            <Link
              href={`/${page.categorySlug}`}
              className="text-slate-300 hover:text-accent transition-colors font-medium"
            >
              {page.category}
            </Link>
            {page.parentService && (
              <>
                <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                <Link
                  href={page.parentService.href}
                  className="text-slate-300 hover:text-accent transition-colors font-medium"
                >
                  {page.parentService.label}
                </Link>
              </>
            )}
            <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
            {isGoalPage && page.parentService ? (
              <>
                <Link
                  href={page.parentService.href}
                  className="text-slate-300 hover:text-accent transition-colors font-medium"
                >
                  {page.parentService.label}
                </Link>
                <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                <span className="font-black text-white">{page.currentPageLabel}</span>
              </>
            ) : (
              <span className="font-black text-white">{page.serviceName}</span>
            )}
          </nav>
        </div>
      </motion.div>

      {/* Main Hero Content */}
      <section
        ref={sectionRef}
        className="relative z-10 mx-auto max-w-[96vw] lg:max-w-[90vw] flex-1 flex items-center px-6"
      >
        <div className="py-12 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-[1fr_480px] items-center lg:items-center lg:gap-8">
            {/* LEFT COLUMN */}
            <motion.div
              className="flex flex-col "
              variants={staggerContainer}
              initial="hidden"
              animate={controls}
            >
              {/* Category / goal badge */}
              <motion.div variants={fadeInUp}>
                {isGoalPage && page.currentPageLabel ? (
                  <Badge
                    className="mb-5 border border-border bg-surface text-accent text-[11px] font-medium tracking-[0.08em] uppercase rounded-full px-3 py-1 hover:bg-surface"
                  >
                    Goal · {page.currentPageLabel}
                  </Badge>
                ) : (
                  <Link href={`/${page.categorySlug}`}>
                    <Badge
                      className="mb-5 border border-border bg-surface text-accent text-[11px] font-medium tracking-[0.08em] uppercase rounded-full px-3 py-1 hover:bg-surface/80 transition-colors cursor-pointer"
                    >
                      {page.category}
                    </Badge>
                  </Link>
                )}
              </motion.div>

              {/* Title */}
              <motion.h1
                className="text-balance text-3xl font-black tracking-loose text-white sm:text-4xl lg:text-5xl leading-[1.15]"
                variants={fadeInUp}
              >
                {page.title}
              </motion.h1>

              {/* Lead */}
              <motion.p
                className="mt-5 max-w-4xl text-base text-surface lg:text-lg"
                variants={fadeInUp}
              >
                {makeBoldInText(page.lead, boldTerms)}
              </motion.p>

              {/* Highlight Pills */}
              {page.highlights && page.highlights.length > 0 && (
                <motion.div
                  className="mt-6 flex flex-wrap gap-2.5"
                  variants={staggerContainer}
                >
                  {page.highlights.map((h) => (
                    <motion.div
                      key={h}
                      variants={fadeInUp}
                      className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm"
                    >
                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                      {h}
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Market Stats */}
              {page.marketStats && page.marketStats.length > 0 && (
                <motion.div
                  className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm sm:grid-cols-4"
                  variants={fadeInUp}
                >
                  {page.marketStats.map((stat) => (
                    <div key={stat.label} className="text-center sm:text-left">
                      <p className="text-2xl font-extrabold text-accent sm:text-3xl">
                        {stat.value}
                      </p>
                      <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* CTA Buttons */}
              <motion.div
                className="mt-8 flex flex-wrap items-center gap-3"
                variants={staggerContainer}
              >
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    asChild
                    size="lg"
                    className="rounded-lg px-7 bg-gradient-to-r from-accent to-accent-hover text-white font-semibold shadow-[0_2px_16px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer border-0"
                  >
                    <Link href="/contact-us">
                      Get your free strategy call
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="group rounded-lg border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/15 hover:border-accent hover:-translate-y-0.5 font-semibold text-white transition-all duration-300 cursor-pointer"
                  >
                    <Link
                      href={
                        isGoalPage && page.parentService
                          ? page.parentService.href
                          : `/${page.categorySlug}`
                      }
                    >
                      {isGoalPage ? "View parent service" : "View all services"}
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Stats Bar */}
              <motion.div className="mt-10 w-full" variants={staggerContainer}>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {stats.map((stat) => (
                    <motion.div
                      key={stat.label}
                      className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-4 sm:py-5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-accent/30 transition-all cursor-default"
                      variants={fadeInUp}
                      whileHover={{
                        y: -2,
                        scale: 1.02,
                        transition: { duration: 0.15 },
                      }}
                    >

                      <div>
                        <Counter targetValue={stat.value} />
                        <p className="text-xs sm:text-sm font-medium text-slate-300 mt-0.5">
                          {stat.label}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                className="mt-8 flex flex-wrap items-center gap-5 text-sm text-slate-300"
                variants={staggerContainer}
              >
                <motion.div className="flex items-center gap-2" variants={fadeInUp}>
                  <div className="flex -space-x-2">
                    {CLIENT_AVATARS.map((avatar) => (
                      <div
                        key={avatar.src}
                        className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white/80"
                      >
                        <Image
                          src={avatar.src}
                          alt={avatar.alt}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <span>
                    <strong className="text-white">150+</strong> clients worldwide
                  </span>
                </motion.div>

                <motion.div className="flex items-center gap-1" variants={fadeInUp}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-accent text-accent"
                    />
                  ))}
                  <span className="ml-1">
                    <strong className="text-white">4.9/5</strong> rating
                  </span>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* RIGHT COLUMN Hero Image */}
            <motion.div
              className="relative shrink-0 max-w-100"
              variants={fadeInRight}
              initial="hidden"
              animate={controls}
            >
              <Image
                src={page.heroImage}
                alt={page.title || "Platform dashboard preview"}
                width={460}
                height={320}
                priority
                className="w-full  rounded-4xl h-auto object-contain drop-shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
