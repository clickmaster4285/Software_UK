'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Suspense } from 'react';

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
// import { CeoVision } from '@/src/components/landingPage/servicesPage/CeoVision';
// import LifecycleSection from '@/src/components/landingPage/slug/LifecycleSection';
// import { ParallaxProjectsSection } from '@/src/components/landingPage/slug/ProjectsSection';
// import Testimonials from '@/src/components/landingPage/Testimonials/page';

export default function ServiceClient({ serviceData }) {
  // Use pricing from serviceData if available (passed from page.js which merged it)
  const pricingPlans = serviceData?.pricing?.map(p => ({
    name: p.type,
    price: p.investment,
    description: p.bestFor,
    period: p.timeline,
    features: p.features || [], // fallback to empty if missing
  })) || [];

  return (
    <main className="min-h-screen bg-background pt-18 relative">

      {/* Premium Breadcrumb */}
      <div className="relative z-20 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-400 px-4 py-4 sm:px-6 lg:px-8">
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
      page style/structure 
     Breadcrumb in the file 
     hero-section jsx file 
      ExploreSection jsx file  
      TrustedClientsSection jsx file 
      AppsSection jsx file 
      ProcessPage  jsx file 
      TechStackSection jsx file 
      FeaturedInsights jsx file remains
      WhyChooseUs jsx file 

      */}

      {/* Main Service Sections */}
      <HeroSection serviceData={serviceData} />
      <ExploreSection serviceData={serviceData} />
      <Suspense fallback={<div className="h-96 animate-pulse bg-surface" />}>
        <TrustedClientsSection
          clients={serviceData?.trustedClients}
          title={`Leading Brands in ${serviceData?.title}`}
          subtitle={`We partner with industry leaders to deliver mission-critical ${serviceData?.title?.toLowerCase()} solutions.`}
        />
      </Suspense>
      <AppsSection />
      <ProcessPage serviceData={serviceData} />
      <TechStackSection />
      <FeaturedInsights />
      <WhyChooseUs
        slug={serviceData?.slug}
        service={serviceData}
      />
      
      <div className="bg-surface">
        <PricingSection
          plans={pricingPlans}
          title={`${serviceData?.title} Pricing`}
        />
      </div>
      <TestimonialsSection />
      <FaqSection faqs={serviceData?.faqs} />
    </main>
  );
}
