"use client";

import { useEffect, useRef, useState } from "react";
import { useBlogList } from "@/hooks/useBlog";
import { useCaseStudyList } from "@/hooks/useCaseStudies";
import Link from "next/link";
import Image from "next/image";
import { resolveImageUrl } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────────

// ─── Unsplash image generator based on title and type ─────────────────────────

const getUnsplashImage = (type, title, index) => {
  // Categories for variety
  const categories = {
    tech: ["technology", "computer", "coding", "software", "ai", "digital"],
    business: ["business", "office", "meeting", "startup", "corporate"],
    design: ["design", "creative", "ui", "ux", "web-design"],
    data: ["data", "analytics", "dashboard", "statistics"],
    cloud: ["cloud", "server", "network", "infrastructure"],
    mobile: ["mobile", "app", "smartphone", "ios", "android"],
    fintech: ["finance", "banking", "money", "crypto", "blockchain"],
    ecommerce: ["shopping", "ecommerce", "retail", "store", "marketplace"],
  };

  // Select category based on title keywords
  let selectedCategory = categories.tech;
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes("fintech") || lowerTitle.includes("finance") || lowerTitle.includes("banking")) {
    selectedCategory = categories.fintech;
  } else if (lowerTitle.includes("ecommerce") || lowerTitle.includes("shop") || lowerTitle.includes("retail")) {
    selectedCategory = categories.ecommerce;
  } else if (lowerTitle.includes("cloud") || lowerTitle.includes("infrastructure")) {
    selectedCategory = categories.cloud;
  } else if (lowerTitle.includes("design") || lowerTitle.includes("ui") || lowerTitle.includes("ux")) {
    selectedCategory = categories.design;
  } else if (lowerTitle.includes("data") || lowerTitle.includes("analytics")) {
    selectedCategory = categories.data;
  } else if (lowerTitle.includes("mobile") || lowerTitle.includes("app")) {
    selectedCategory = categories.mobile;
  } else if (lowerTitle.includes("business") || lowerTitle.includes("startup")) {
    selectedCategory = categories.business;
  }

  // Pick a keyword from the category
  const keyword = selectedCategory[index % selectedCategory.length];
  
  // Unsplash image URL with specific dimensions (800x600 for landscape, 800x1000 for portrait)
  const width = 800;
  const height = type === "Case Study" && index === 0 ? 1000 : 600;
  
  return `https://source.unsplash.com/featured/${width}x${height}/?${keyword}&sig=${index}`;
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function thumb(raw, type, title, index) {
  if (raw?.trim()) {
    return resolveImageUrl(raw);
  }
  return getUnsplashImage(type, title, index);
}

function blogHref(post) {
  const slug = post.slug?.trim() || post._id;
  return `/blog/${encodeURIComponent(slug)}`;
}

function caseStudyHref(cs) {
  const slug = cs.slug?.trim() || cs._id;
  return `/case-studies/${encodeURIComponent(slug)}`;
}

// ─── Animated card with scroll animation ─────────────────────────────────────────────

const InsightCardItem = ({ card, tall = false }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Set image source after mount to avoid hydration issues
    const timer = setTimeout(() => setImgSrc(card.thumbnail), 0);
    return () => clearTimeout(timer);
  }, [card.thumbnail]);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimated) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          // Staggered delay based on card index for smooth wave effect
          const delay = (card.index % 3) * 100 + (Math.floor(card.index / 3) * 50);
          setTimeout(() => {
            setVisible(true);
            setHasAnimated(true);
          }, delay);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px" // Triggers slightly before card enters viewport
      }
    );
    
    observer.observe(el);
    return () => observer.disconnect();
  }, [card.index, hasAnimated]);

  return (
    <Link
      ref={ref}
      href={card.href}
      className={[
        "relative rounded-2xl overflow-hidden cursor-pointer group block",
        "transition-all duration-700 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
      ].join(" ")}
      style={{
        transitionProperty: "all",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div
        className={[
          "relative w-full overflow-hidden bg-linear-to-br from-gray-800 to-gray-900",
          tall ? "aspect-4/5" : "aspect-16/10"
        ].join(" ")}
      >
        {imgSrc && (
          <Image
            src={imgSrc}
            alt={card.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3">
        {/* stronger dark gradient base (fixes readability instantly) */}
        <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/60 to-transparent" />

        {/* subtle glass blur ONLY at bottom */}
        <div className="absolute inset-0 backdrop-blur-[3px]" />

        {/* content always above */}
        <div className="relative z-10">
          <p className="text-[11px] font-medium mb-1 text-accent">
            {card.type}
          </p>

          <p className="text-white text-[13px] font-medium leading-snug line-clamp-2">
            {card.title}
          </p>
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl transition-shadow duration-300 group-hover:shadow-[0_20px_48px_rgba(0,0,0,0.35)] pointer-events-none" />
    </Link>
  );
};

// ─── Skeleton ──────────────────────────────────────────────────────────────────

const SkeletonCard = ({ tall = false }) => (
  <div
    className={[
      "rounded-2xl bg-linear-to-br from-gray-200 to-gray-300 animate-pulse",
      tall ? "aspect-4/5" : "aspect-16/10"
    ].join(" ")}
  />
);

// ─── Text Section Component ────────────────────────────────────────────────────

const InsightsHeader = () => {
  // Header animation on scroll
  const headerRef = useRef(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={headerRef}
      className={[
        "flex flex-col gap-5 lg:sticky lg:top-24 transition-all duration-700 ease-out",
        headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      ].join(" ")}
    >
      <p
        className="text-xs tracking-widest uppercase font-medium text-accent"
      >
        Success Stories
      </p>
      <h2
        className="text-3xl xl:text-4xl font-medium leading-tight text-primary"
      >
        Stories of our transformations{" "}
        <span className="text-accent">
          across Services and Industries
        </span>
      </h2>
    
      <p className="text-base text-gray-800" >
       From Concept to Completion. We deliver enterprise-grade solutions for modern
  businesses, combining innovative technology with strategic execution. With a
  proven track record of successful deliveries across industries worldwide, we
  transform ideas into impactful digital experiences that drive real growth.
      </p>
     

      <Link
        href="/blog"
        className="w-fit px-6 py-2.5 rounded-full text-white text-sm font-medium transition-opacity hover:opacity-90 bg-accent"
      >
        Explore More
      </Link>
    </div>
  );
};

// ─── Cards Section Component ───────────────────────────────────────────────────

const InsightsCards = ({ cards, isLoading }) => {
  
  const col1Cards = cards.slice(0, 2);
  const col2Cards = cards.slice(2, 5);
  const col3Cards = cards.slice(5, 8);

  return (
    <>
      {/* Column 1 - 2 cards */}
      <div className="flex flex-col gap-4 w-65 xl:w-[320px] justify-center">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          col1Cards.map((card, idx) => (
            <InsightCardItem key={card.id} card={card} tall={false} />
          ))
        )}
      </div>

      {/* Column 2 - 3 cards */}
      <div className="flex flex-col gap-4 w-65 xl:w-[320px]">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          col2Cards.map((card) => (
            <InsightCardItem key={card.id} card={card} />
          ))
        )}
      </div>

      {/* Column 3 - 3 cards */}
      <div className="flex flex-col gap-4 w-65 xl:w-[320px]">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          col3Cards.map((card) => (
            <InsightCardItem key={card.id} card={card} />
          ))
        )}
      </div>
    </>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────

export default function FeaturedInsights() {
  const { data: blogs = [], isLoading: blogsLoading } = useBlogList();
  const { data: caseStudies = [], isLoading: csLoading } = useCaseStudyList();

  const isLoading = blogsLoading || csLoading;

  const publishedCS = caseStudies.filter((c) => c.published !== false).slice(0, 4);
  const publishedBlogs = blogs.filter((b) => b.published !== false).slice(0, 4);

  // Layout order to achieve: Col1 (2 cards), Col2 (3 cards), Col3 (3 cards)
  const slotOrder = [
    "cs", "blog",  // First column
    "cs", "blog", "cs",  // Second column  
    "blog", "cs", "blog"  // Third column
  ];

  const cards = [];
  let csIdx = 0;
  let blogIdx = 0;

  for (const slot of slotOrder) {
    if (slot === "cs" && csIdx < publishedCS.length) {
      const cs = publishedCS[csIdx++];
      cards.push({
        id: cs._id,
        type: "Case Study",
        title: cs.title,
        thumbnail: thumb(cs.thumbnail, "Case Study", cs.title, cards.length),
        href: caseStudyHref(cs),
        index: cards.length,
      });
    } else if (slot === "blog" && blogIdx < publishedBlogs.length) {
      const blog = publishedBlogs[blogIdx++];
      cards.push({
        id: blog._id,
        type: "Blog",
        title: blog.title,
        thumbnail: thumb(blog.thumbnail, "Blog", blog.title, cards.length),
        href: blogHref(blog),
        index: cards.length,
      });
    }
  }

  return (
    <section
      className="w-full px-4 sm:px-6 lg:px-8 xl:px-22 py-16 overflow-hidden bg-linear-to-b from-white to-slate-50 "
     
    >
      {/* Mobile layout: 2 columns grid */}
      <div className="lg:hidden">
        <div className="mb-10">
          <InsightsHeader />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {isLoading ? (
            <>
              <SkeletonCard tall />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            cards.map((card) => (
              <InsightCardItem key={card.id} card={card} tall={card.index === 0} />
            ))
          )}
        </div>
      </div>

      {/* Desktop layout: 3 columns with exact distribution (2, 3, 3) */}
      <div className="hidden lg:flex justify-between gap-6 xl:gap-8 lg:px-16">
        {/* Header - left side */}
        <div className="sticky top-24 shrink-0 w-70 xl:w-130">
          <InsightsHeader />
        </div>

        {/* Cards wrapper - 3 columns with exact distribution */}
        <div className="flex gap-6 xl:gap-8 flex-1 justify-end">
          <InsightsCards cards={cards} isLoading={isLoading} />
        </div>
      </div>
    </section>
  );
}