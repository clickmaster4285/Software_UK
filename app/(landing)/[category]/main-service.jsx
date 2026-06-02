'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Suspense, useRef } from 'react';
import dynamic from 'next/dynamic';

// Eager: Hero is above-the-fold
import { HeroSection } from '@/components/landing/main-service/hero-section';
import { ScrollSnakeLine } from '@/components/ui/scroll-snake-line';

// Lazy: default export components
const ExploreSection = dynamic(() => import('@/components/landing/main-service/ExploreSection'), { ssr: true });
const PainPointsSolutions = dynamic(() => import('@/components/landing/main-service/PainPointsSolutions'), { ssr: true });
const TrustedClientsSection = dynamic(() => import('@/components/landing/main-service/TrustedClientsSection'), { ssr: true });
const AppsSection = dynamic(() => import('@/components/landing/main-service/AppsSection'), { ssr: true });
const ProcessPage = dynamic(() => import('@/components/landing/main-service/ProcessPage'), { ssr: true });
const FeaturedInsights = dynamic(() => import('@/components/landing/main-service/FeaturedInsights'), { ssr: true });
const IndustriesSection = dynamic(() => import('@/components/landing/main-service/industries-section'), { ssr: true });
const TestimonialsSection = dynamic(() => import('@/components/landing/main-service/TestimonialsSection'), { ssr: true });

// Lazy: named export components — wrap as component functions
const TechStackSection = dynamic(() =>
  import('@/components/landing/main-service/TechStackSection').then(mod => {
    const Comp = mod.TechStackSection;
    const Wrapper = (props) => <Comp {...props} />;
    Wrapper.displayName = 'TechStackSection';
    return Wrapper;
  }),
  { ssr: true }
);

const WhyChooseUs = dynamic(() =>
  import('@/components/landing/main-service/whyUs').then(mod => {
    const Comp = mod.WhyChooseUs;
    const Wrapper = (props) => <Comp {...props} />;
    Wrapper.displayName = 'WhyChooseUs';
    return Wrapper;
  }),
  { ssr: true }
);

const PricingSection = dynamic(() =>
  import('@/components/landing/main-service/pricing-section').then(mod => {
    const Comp = mod.PricingSection;
    const Wrapper = (props) => <Comp {...props} />;
    Wrapper.displayName = 'PricingSection';
    return Wrapper;
  }),
  { ssr: true }
);

const FaqSection = dynamic(() =>
  import('@/components/landing/main-service/FaqSection').then(mod => {
    const Comp = mod.FaqSection;
    const Wrapper = (props) => <Comp {...props} />;
    Wrapper.displayName = 'FaqSection';
    return Wrapper;
  }),
  { ssr: true }
);

const FinalCTA = dynamic(() =>
  import('@/components/landing/main-service/finalCta').then(mod => {
    const Comp = mod.FinalCTA;
    const Wrapper = (props) => <Comp {...props} />;
    Wrapper.displayName = 'FinalCTA';
    return Wrapper;
  }),
  { ssr: true }
);

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
