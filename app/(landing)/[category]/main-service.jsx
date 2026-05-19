'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Suspense, useRef } from 'react';

// Import refined landing components
import { HeroSection } from '@/components/landing/main-service/hero-section';
import { ExploreSection } from '@/components/landing/main-service/ExploreSection';
import { TrustedClientsSection } from '@/components/landing/main-service/TrustedClientsSection';
import { AppsSection } from '@/components/landing/main-service/AppsSection';
import { ProcessPage } from '@/components/landing/main-service/ProcessPage';
import { TechStackSection } from '@/components/landing/main-service/TechStackSection';
import FeaturedInsights from '@/components/landing/main-service/FeaturedInsights';
import { WhyChooseUs } from '@/components/landing/main-service/whyUs';
import { PricingSection } from '@/components/landing/main-service/pricing-section';
import { TestimonialsSection } from '@/components/landing/main-service/TestimonialsSection';
import { FaqSection } from '@/components/landing/main-service/FaqSection';
import PainPointsSolutions from '@/components/landing/main-service/PainPointsSolutions';
import { IndustriesSection } from '@/components/landing/main-service/industries-section';
import { FinalCTA } from '@/components/landing/main-service/finalCta';
import { ScrollSnakeLine } from '@/components/ui/scroll-snake-line';

export default function ServiceClient({ serviceData }) {
  const scrollPathRef = useRef(null);

  // Use pricing from serviceData if available (passed from page.js which merged it)
  const pricingPlans =
    serviceData?.pricing?.map((p, index) => ({
      name: p.type,
      price: p.investment,
      description: p.bestFor,
      period: p.timeline,
      features: p.features || [],
      popular: index === 1,
      cta: index === 0 ? 'Get a Quote' : index === 2 ? 'Contact Sales' : 'Start Project',
    })) || [];

  return (
    <main className="min-h-screen bg-background pt-18 relative overflow-x-hidden">

      {/* Premium Breadcrumb */}
      <div className="relative z-20 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-[1200px] px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm font-medium">
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary transition-colors duration-200 font-body"
            >
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-border" />
            <span className="text-foreground font-heading font-semibold">
              {serviceData?.title}
            </span>
          </nav>
        </div>
      </div>

      {/*
      Used sections from components/landing/main-service
      ------------------------------------------------
      1. Breadcrumb (Defined in-file)
      2. HeroSection (hero-section.jsx)
      3. ExploreSection (ExploreSection.jsx)
      4. PainPointsSolutions (PainPointsSolutions.jsx)
      5. TrustedClientsSection (TrustedClientsSection.jsx)
      6. AppsSection (AppsSection.jsx)
      7. ProcessPage (ProcessPage.jsx)
      8. TechStackSection (TechStackSection.jsx)
      9. FeaturedInsights (FeaturedInsights.jsx)
      10. WhyChooseUs (whyUs.jsx)
      11. IndustriesSection (industries-section.jsx)
      12. PricingSection (pricing-section.jsx)
      13. TestimonialsSection (TestimonialsSection.jsx)
      14. FaqSection (FaqSection.jsx)
      15. FinalCTA (finalCta.jsx)

      Unused sections from components/landing/main-service
      --------------------------------------------------
      ├── AboutSection.jsx
      ├── CommunitySection.jsx
      ├── CTASectionImage.jsx
      ├── global-globe-section.jsx
      ├── help-section.jsx
      ├── hero-spline-panel.jsx
      ├── home-quote-form.jsx
      ├── info-cts.jsx
      ├── LandingHomeDeferredHeavy.jsx
      ├── Solutions.jsx
      └── TrustedBySection.jsx
      */}

      {/* Main Service Sections */}
      <HeroSection serviceData={serviceData} />
      
      {/* Shared Scroll Path for Snake Line */}
      <div ref={scrollPathRef} className="relative">
        <ScrollSnakeLine targetRef={scrollPathRef} />
        
        <ExploreSection serviceData={serviceData} />
        
        <PainPointsSolutions />
        
        <Suspense fallback={<div className="h-96 animate-pulse bg-surface" />}>
          <TrustedClientsSection
            clients={serviceData?.trustedClients}
            title={`${serviceData?.title}`}
            subtitle={`We partner with industry leaders to deliver mission-critical ${serviceData?.title?.toLowerCase()} solutions.`}
          />
        </Suspense>
      </div>

      <AppsSection />
      <ProcessPage serviceData={serviceData} />
      <TechStackSection />
      <FeaturedInsights />
      <WhyChooseUs
        slug={serviceData?.slug}
        service={serviceData}
      />

      <PricingSection
        plans={pricingPlans}
        title={`${serviceData?.title} Investment`}
        subtitle={`Flexible engagement models for ${serviceData?.title?.toLowerCase() || 'your project'} — scoped to your timeline, team size, and goals.`}
      />

      <IndustriesSection />
      
      <TestimonialsSection serviceTitle={serviceData?.title} />
      
      <FaqSection
        faqs={serviceData?.faqs}
        serviceTitle={serviceData?.title}
        subtitle={`Common questions about ${serviceData?.title?.toLowerCase() || 'our services'}, delivery, and engagement models.`}
      />

      <FinalCTA />
    </main>
  );
}
