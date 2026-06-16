"use client";

import { useState, useMemo, useEffect, lazy, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import MegaMenu from "./MegaMenu";
import HomeLogoLink from "./HomeLogoLink";
import { serviceMenuSections } from "@/data/main-services";
import { ChevronDown } from "lucide-react";
import { caseStudyListings } from "@/data/case-studies";

const ResourcesMegaMenu = lazy(() => import("./ResourcesMegaMenu"));

const navLinks = [
  { name: "Solutions", href: "/solutions" },
  { name: "Services", href: "/services", hasMegaMenu: true },
  { name: "Resources", href: "/blog", hasMegaMenu: true },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

// Slugs for service categories to identify service routes dynamically
const serviceCategorySlugs = serviceMenuSections.map((s) => s.slug);

// Other specific routes that should always have a white background
const forceWhiteBgRoutes = [];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine if the navbar should have a white background based on scroll or route
  const hasWhiteBg = useMemo(() => {
    if (isScrolled) return true;

    const pathSegments = pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      const rootSegment = pathSegments[0];
      // If the first part of the URL is a service category
      if (serviceCategorySlugs.includes(rootSegment)) return true;
    }

    // Check against other explicitly defined white-background routes
    return forceWhiteBgRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));
  }, [isScrolled, pathname]);

  const caseStudyItems = useMemo(() => ({
    label: "Case Studies",
    viewAllHref: "/case-studies",
    items: caseStudyListings.slice(0, 2).map(cs => ({
      type: "case-study",
      title: cs.title,
      excerpt: cs.metaDesc,
      category: cs.sector?.split('/')[0]?.replace(/[\uD800-\uDFFF]/g, '').trim() || "Project",
      thumbnail: null,
      href: `/case-studies/${cs.slug}`,
      emoji: "📁",
      sectorColor: "bg-slate-400",
      country: cs.country,
      technologies: cs.technologies?.slice(0, 4),
    }))
  }), []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${hasWhiteBg
      ? "bg-white/95 backdrop-blur-sm border-b border-border py-2 shadow-sm"
      : "bg-transparent pt-6"
      }`}>
      <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto px-6 flex items-center justify-between">
        <HomeLogoLink className="flex items-center">
          <Image
            src="/cm-logos/logo.webp"
            alt="ClickMasters"
            width={180}
            height={30}
            priority
            style={{ width: "auto", height: "auto" }}
            className={`h-8 w-auto transition-all ${!hasWhiteBg ? "brightness-0 invert" : ""}`}
          />
        </HomeLogoLink>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            if (link.name === "Resources") {
              return (
                <Suspense key={link.name} fallback={
                  <div className={`flex items-center gap-1 font-body text-sm cursor-pointer ${hasWhiteBg ? "text-text-body" : "text-white"}`}>
                    {link.name}
                    <ChevronDown className="w-3 h-3" />
                  </div>
                }>
                  <ResourcesMegaMenu
                    hasWhiteBg={hasWhiteBg}
                    caseStudyItems={caseStudyItems}
                  />
                </Suspense>
              );
            }
            if (link.hasMegaMenu) {
              return (
                <MegaMenu
                  key={link.name}
                  categories={serviceMenuSections}
                  trigger={
                    <div className={`flex items-center gap-1 transition-colors font-body text-sm cursor-pointer ${hasWhiteBg ? "text-text-body hover:text-primary" : "text-white hover:text-accent"
                      }`}>
                      {link.name}
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  }
                />
              );
            }
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors font-body text-sm ${hasWhiteBg ? "text-text-body hover:text-primary" : "text-white hover:text-accent"
                  }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/contact"
            className="px-5 py-2.5 bg-accent text-white font-body text-sm font-medium rounded-lg hover:bg-accent-hover transition-colors shadow-lg"
          >
            Hire Us
          </Link>
        </div>

        <button
          className={`md:hidden p-2 transition-colors ${hasWhiteBg ? "text-primary" : "text-white"}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-border">
          <div className="px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-text-body font-body py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/contact"
              className="px-5 py-2.5 bg-accent text-white font-body text-sm font-medium rounded-lg text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Hire Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
