'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Suspense, useRef } from 'react';
import dynamic from 'next/dynamic';

import { HeroSection } from '@/components/landing/main-service/hero-section';
import { ScrollSnakeLine } from '@/components/ui/scroll-snake-line';

const OverviewSection = dynamic(() => import('@/components/landing/main-service/OverviewSection'), { ssr: true });
const ContentSections = dynamic(() => import('@/components/landing/main-service/ContentSections'), { ssr: true });
const PainPointsSolutions = dynamic(() => import('@/components/landing/main-service/PainPointsSolutions'), { ssr: true });
const TrustedClientsSection = dynamic(() => import('@/components/landing/main-service/TrustedClientsSection'), { ssr: true });
const ProcessPage = dynamic(() => import('@/components/landing/main-service/ProcessPage'), { ssr: true });
const FaqSection = dynamic(() => import('@/components/landing/main-service/FaqSection'), { ssr: true });

const ExploreSection = dynamic(() =>
  import('@/components/landing/main-service/ExploreSection').then(mod => {
    const C = mod.ExploreSection; const W = (p) => <C {...p} />; W.displayName = 'ExploreSection'; return W;
  }), { ssr: true }
);
const AppsSection = dynamic(() =>
  import('@/components/landing/main-service/AppsSection').then(mod => {
    const C = mod.AppsSection; const W = (p) => <C {...p} />; W.displayName = 'AppsSection'; return W;
  }), { ssr: true }
);
const IndustriesSection = dynamic(() =>
  import('@/components/landing/main-service/industries-section').then(mod => {
    const C = mod.IndustriesSection; const W = (p) => <C {...p} />; W.displayName = 'IndustriesSection'; return W;
  }), { ssr: true }
);
const TestimonialsSection = dynamic(() =>
  import('@/components/landing/main-service/TestimonialsSection').then(mod => {
    const C = mod.TestimonialsSection; const W = (p) => <C {...p} />; W.displayName = 'TestimonialsSection'; return W;
  }), { ssr: true }
);
const TechStackSection = dynamic(() =>
  import('@/components/landing/main-service/TechStackSection').then(mod => {
    const C = mod.TechStackSection; const W = (p) => <C {...p} />; W.displayName = 'TechStackSection'; return W;
  }), { ssr: true }
);
const WhyChooseUs = dynamic(() =>
  import('@/components/landing/main-service/whyUs').then(mod => {
    const C = mod.WhyChooseUs; const W = (p) => <C {...p} />; W.displayName = 'WhyChooseUs'; return W;
  }), { ssr: true }
);
const PricingSection = dynamic(() =>
  import('@/components/landing/main-service/pricing-section').then(mod => {
    const C = mod.PricingSection; const W = (p) => <C {...p} />; W.displayName = 'PricingSection'; return W;
  }), { ssr: true }
);
const FinalCTA = dynamic(() =>
  import('@/components/landing/main-service/finalCta').then(mod => {
    const C = mod.FinalCTA; const W = (p) => <C {...p} />; W.displayName = 'FinalCTA'; return W;
  }), { ssr: true }
);

export default function ServiceClient({ serviceData }) {
  const scrollPathRef = useRef(null);

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
    <main className="min-h-screen bg-background pt-18 relative overflow-x-clip">
      <div className="relative z-20 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-[96vw] lg:max-w-[90vw] px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm font-medium" aria-label="Breadcrumb">
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary transition-colors duration-200 font-body"
            >
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-border" aria-hidden />
            <span className="text-foreground font-heading font-semibold">
              {serviceData?.title}
            </span>
          </nav>
        </div>
      </div>

      {/* 1. Hero */}
      <HeroSection serviceData={serviceData} />

      {/* 2. Overview (remaining MD intro) */}
      <OverviewSection serviceData={serviceData} />

      <div ref={scrollPathRef} className="relative">
        <ScrollSnakeLine targetRef={scrollPathRef} />

        {/* 3. Explore */}
        <div className="bg-surface">
          <ExploreSection serviceData={serviceData} />
        </div>

        {/* 4. MD body sections (was deferred — 155 sections were orphaned) */}
        <div className="bg-background">
          <ContentSections serviceData={serviceData} />
        </div>

        {/* 5. Pain points */}
        <div className="bg-surface">
          <PainPointsSolutions serviceData={serviceData} />
        </div>
      </div>

       {/* 11. Social proof */}
       <div className="bg-background">
        <Suspense fallback={<div className="h-64 animate-pulse bg-surface" aria-hidden />}>
          <TrustedClientsSection
            clients={serviceData?.trustedClients}
            title={`${serviceData?.title}`}
            subtitle={`We partner with industry leaders to deliver mission-critical ${serviceData?.title?.toLowerCase()} solutions.`}
          />
        </Suspense>
      </div>

      {/* 6. Process */}
      <div className="bg-background">
        <ProcessPage serviceData={serviceData} />
      </div>

      {/* 7. Why choose */}
      <div className="bg-surface">
        <WhyChooseUs slug={serviceData?.slug} service={serviceData} />
      </div>

      {/* 8. Tech */}
      <div className="bg-background">
        <TechStackSection serviceData={serviceData} />
      </div>

      {/* 9. Industries */}
      <div className="bg-surface">
        <IndustriesSection serviceData={serviceData} />
      </div>

      {/* 10. Pricing */}
      <PricingSection
        plans={pricingPlans}
        title={`${serviceData?.title} Investment`}
        subtitle={`Flexible engagement models for ${serviceData?.title?.toLowerCase() || 'your project'} — scoped to your timeline, team size, and goals.`}
        costFactors={serviceData?.costFactors}
        engagementModels={serviceData?.engagementModels}
      />

      <div className="bg-surface">
        <AppsSection />
      </div>

      <div className="bg-background">
        <TestimonialsSection serviceTitle={serviceData?.title} />
      </div>

      {/* 12. FAQ */}
      <div className="bg-surface">
        <FaqSection
          faqs={serviceData?.faqs}
          serviceTitle={serviceData?.title}
          subtitle={`Common questions about ${serviceData?.title?.toLowerCase() || 'our services'}, delivery, and engagement models.`}
        />
      </div>

      {/* 13. Final CTA */}
      <FinalCTA serviceData={serviceData} />
    </main>
  );
}
