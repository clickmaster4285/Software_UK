import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { notFound, redirect } from 'next/navigation';
import Script from 'next/script';
import { cn } from '@/lib/utils';
import { breadcrumbSchema, faqSchema, homepageFaqSchema, serviceSchema, siteConfig } from '@/app/metadata-config';
import { getSectionId } from '@/lib/subservice-utils';
import {
  getAllServicePages,
  getServicePage,
  getServiceTechnologies,
  slugify,
} from '@/data/sub-services';
import { ServiceHero } from '@/components/landing/sub-services/service-hero';
import DynamicSections from '@/components/landing/sub-services/DynamicSections';
import { ServicesSection } from '@/components/landing/sub-services/ServicesSection';
import { EngineeringBaseline } from '@/components/landing/sub-services/EngineeringBaseline';
import { WhyChooseUs } from '@/components/landing/sub-services/WhyChooseUs';
import { TechStack } from '@/components/landing/sub-services/TechStack';
import { CTAComponents } from '@/components/landing/sub-services/FooterCTA';
import { CeoVision } from '@/components/landing/sub-services/CeoVision';
import { ClientScrollWheel } from './ClientScrollWheel';

// Dynamically import heavy below-the-fold components
const ProcessSection = dynamic(() => import('@/components/landing/sub-services/ProcessSection').then(mod => mod.ProcessSection));
const IndustriesSection = dynamic(() => import('@/components/landing/sub-services/IndustriesSection').then(mod => mod.IndustriesSection));
const CaseStudySection = dynamic(() => import('@/components/landing/sub-services/CaseStudySection').then(mod => mod.CaseStudySection), {
  ssr: true,
});
const PricingSection = dynamic(() => import('@/components/landing/sub-services/PricingSection').then(mod => mod.PricingSection));
const TestimonialsSection = dynamic(() => import('@/components/landing/sub-services/TestimonialsSection').then(mod => mod.TestimonialsSection));
const FAQSection = dynamic(() => import('@/components/landing/sub-services/FAQSection').then(mod => mod.FAQSection));

const defaultFaqs = homepageFaqSchema.mainEntity.map((item) => ({
  question: item.name,
  answer: item.acceptedAnswer.text,
}));

export async function generateStaticParams() {
  return getAllServicePages().map((page) => ({
    category: page.categorySlug,
    service: page.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { category, service } = await params;
  const page = getServicePage(service);
  if (!page || page.categorySlug !== category) return { title: 'Service' };

  const description = page.metaDescription;
  const canonicalPath = getCanonicalPath(page);
  const canonical = `${siteConfig.url}${canonicalPath}`;

  return {
    title: page.metaTitle ?? `${page.title} Services | ClickMasters`,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${page.title} | ClickMasters`,
      description,
      url: canonical,
      images: [
        {
          url: `${siteConfig.url}/og/services.webp`,
          width: 1200,
          height: 630,
          alt: `${page.title} ClickMasters software services`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${page.title} | ClickMasters`,
      description,
      images: [`${siteConfig.url}/og/services.webp`],
    },
  };
}

function getCanonicalPath(page) {
  return `/${page.categorySlug}/${page.slug}`;
}

export default async function ServiceByCategoryPage({ params }) {
  const { category, service } = await params;
  const page = getServicePage(service);

  if (!page) notFound();

  // If the category slug doesn't match, redirect to the correct one (canonical URL)
  if (page.categorySlug !== category) {
    redirect(`/${page.categorySlug}/${page.slug}`);
  }

  const sections = page.sections || [];
  const faqs = page.faqs || [];
  const canonicalPath = getCanonicalPath(page);
  const url = `${siteConfig.url}${canonicalPath}`;
  const techStack = getServiceTechnologies(service);

  const tocItems = [
    { id: 'overview', title: 'Overview', level: 2 },
  ];

  sections.forEach((section, index) => {
    const id = getSectionId(section.heading, index, slugify);
    if (!tocItems.find(item => item.id === id)) {
      tocItems.push({ id, title: section.heading, level: 2 });
    }
  });

  if (page.servicesCards && !tocItems.find(item => item.id === 'our-services')) {
    tocItems.push({ id: 'our-services', title: 'Our Services', level: 2 });
  }

  if (page.differentiators && !tocItems.find(item => item.id === 'why-choose-us')) {
    tocItems.push({ id: 'why-choose-us', title: 'Why Choose Us', level: 2 });
  }

  if (page.checklist) {
    tocItems.push({ id: 'checklist', title: 'Engineering Baseline', level: 2 });
  }

  if (page.processPhases && !tocItems.find(item => item.id === 'our-process')) {
    tocItems.push({ id: 'our-process', title: 'Our Process', level: 2 });
  }

  if (techStack.length > 0 && !tocItems.find(item => item.id === 'tech-stack')) {
    tocItems.push({ id: 'tech-stack', title: 'Technology Stack', level: 2 });
  }

  if (page.industryUseCases && !tocItems.find(item => item.id === 'industries')) {
    tocItems.push({ id: 'industries', title: 'Industries', level: 2 });
  }

  if (page.pricingTiers && !tocItems.find(item => item.id === 'pricing')) {
    tocItems.push({ id: 'pricing', title: 'Pricing', level: 2 });
  }

  if (page.tables) {
    page.tables.forEach((table) => {
      const id = slugify(table.title);
      if (!tocItems.find(item => item.id === id)) {
        tocItems.push({ id, title: table.title, level: 2 });
      }
    });
  }

  tocItems.push({ id: 'testimonials', title: 'Testimonials', level: 2 });
  tocItems.push({ id: 'case-study', title: 'Case Study', level: 2 });

  if (faqs.length > 0) {
    tocItems.push({ id: 'faq', title: 'FAQ', level: 2 });
  }

  const serviceJsonLd = serviceSchema(page.serviceName, page.metaDescription, url);
  const faqJsonLd = faqSchema(faqs.length > 0 ? faqs : defaultFaqs);

  return (
    <>
      <Script
        id={`service-schema-${page.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Script
        id={`faq-schema-${page.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Script
        id={`breadcrumb-${page.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: 'Services', url: '/services' },
              { name: page.category, url: `/${page.categorySlug}` },
              { name: page.serviceName, url: canonicalPath },
            ])
          ),
        }}
      />

      <div className="min-h-screen text-primary relative overflow-x-hidden">
        <ClientScrollWheel tocItems={tocItems} />

        <div id="overview">
          <ServiceHero page={page} />
        </div>

        <div className="px-4 md:px-8">
          <main className="">
            {sections.length > 0 && (
              <DynamicSections
                sections={sections}
                serviceName={page.serviceName}
              />
            )}

            {page.servicesCards && (
              <ServicesSection
                serviceName={page.serviceName}
                servicesCards={page.servicesCards}
              />
            )}

            {page.differentiators && (
              <WhyChooseUs
                slug={page.slug}
                differentiators={page.differentiators}
              />
            )}

            <div id="checklist" className="scroll-mt-20">
              {page.checklist && (
                <EngineeringBaseline
                  serviceName={page.serviceName}
                  checklist={page.checklist}
                />
              )}
            </div>

            <div id="our-process" className="scroll-mt-20">
              {page.processPhases && (
                <ProcessSection
                  serviceName={page.serviceName}
                  processPhases={page.processPhases}
                />
              )}
            </div>

            <div id="tech-stack" className="scroll-mt-20">
              <div style={{ maxWidth: '1460px' }} className="mx-auto">
                {techStack.length > 0 && <TechStack techStack={techStack} />}
              </div>
            </div>

            <div id="industries" className="scroll-mt-20">
              {page.industryUseCases && (
                <IndustriesSection industryUseCases={page.industryUseCases} />
              )}
            </div>

            <div id="pricing" className="scroll-mt-20">
              {page.pricingTiers && (
                <PricingSection
                  serviceName={page.serviceName}
                  pricingTiers={page.pricingTiers}
                />
              )}
            </div>

            <CeoVision />

            {page.tables && page.tables.map((table) => (
              <section key={table.title} id={slugify(table.title)} className="mx-auto max-w-400 scroll-mt-20 pt-16">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-1 rounded-full bg-primary" />
                  <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                    {table.title}
                  </h2>
                </div>
                <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50">
                          {table.headers.map((header) => (
                            <th key={header} className="px-6 py-4 font-semibold text-slate-900 border-b border-slate-200">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {table.rows.map((row, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 text-sm sm:text-base">
                            {row.map((cell, j) => (
                              <td key={j} className="px-6 py-4 text-slate-600 border-b border-slate-100">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="my-16 flex items-center gap-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                </div>
              </section>
            ))}

            <div id="testimonials" className="scroll-mt-20">
              <TestimonialsSection />
            </div>

            <div id="case-study" className="scroll-mt-20 mx-auto max-w-400">
              <div className="w-full flex flex-col mt-4">
                <div className="flex items-center gap-3 px-8 ">
                  <div className="h-8 sm:h-10 w-1 rounded-full bg-accent" />
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900">
                    Success Stories
                  </h2>
                </div>
              </div>
              <CaseStudySection serviceName={page.serviceName} />
            </div>

            <div id="faq" className="scroll-mt-20">
              {faqs.length > 0 && <FAQSection faqs={faqs} />}
            </div>
          </main>
        </div>

        <section className="border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white py-20">
          <div className="mx-auto max-w-5xl px-5 text-center md:px-8">
            <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              Explore Related Capabilities
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Discover how we can help transform your business through our comprehensive services,
              real-world case studies, or our full solutions portfolio.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}