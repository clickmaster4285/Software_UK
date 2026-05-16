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

export default function ServiceClient({ serviceData }) {
  // Map features to WhyChooseUs items if they exist
  const whyUsItems = serviceData?.features?.map((f) => ({
    title: f.title,
    desc: f.description,
  })) || [];

  // Use pricing from serviceData if available (passed from page.js which merged it)
  const pricingPlans = serviceData?.pricing?.map(p => ({
    name: p.type,
    price: p.investment,
    description: p.bestFor,
    period: p.timeline,
    features: p.features || [], // fallback to empty if missing
  })) || [];

  return (
    <main className="min-h-screen bg-white">
      {/* Premium Breadcrumb */}
      <div className="relative z-20 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm font-medium">
            <Link 
              href="/" 
              className="text-slate-500 hover:text-primary transition-colors duration-200 font-body"
            >
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-slate-300" />
            <Link 
              href="/services" 
              className="text-slate-500 hover:text-primary transition-colors duration-200 font-body"
            >
              Services
            </Link>
            <ChevronRight className="h-4 w-4 text-slate-300" />
            <span className="text-slate-900 font-heading font-semibold">
              {serviceData?.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Service Sections */}
      <HeroSection serviceData={serviceData} />
      <ExploreSection serviceData={serviceData} />
      <Suspense fallback={<div className="h-96 animate-pulse bg-slate-50" />}>
        <TrustedClientsSection />
      </Suspense>
      <AppsSection />
      <ProcessPage serviceData={serviceData} />
      <TechStackSection />
      
      <div className="py-20 lg:py-32">
        <WhyChooseUs 
          items={whyUsItems} 
          subtitle={`Discover why leading enterprises trust our ${serviceData?.title?.toLowerCase()} expertise.`}
        />
      </div>

      <div className="bg-slate-50">
        <PricingSection 
          plans={pricingPlans} 
          title={`${serviceData?.title} Pricing`}
        />
      </div>
      <TestimonialsSection />
      <FeaturedInsights /> 
      <FaqSection faqs={serviceData?.faqs} />
    </main>
  );
}