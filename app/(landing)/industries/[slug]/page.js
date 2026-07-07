import Link from 'next/link';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import {
  getIndustryBySlug,
  getAllIndustrySlugs,
  getRelatedIndustries,
} from '@/data/industries';
import { siteConfig, breadcrumbSchema, faqSchema, serviceSchema } from '@/app/metadata-config';
import { slugify } from '@/data/sub-services';
import IndustrySections from '@/app/(landing)/industries/[slug]/IndustrySections';

export async function generateStaticParams() {
  return getAllIndustrySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);
  if (!industry) return { title: 'Industry' };

  const canonicalPath = `/industries/${industry.slug}`;
  const canonical = `${siteConfig.url}${canonicalPath}`;

  return {
    title: industry.metaTitle ?? `${industry.title} | ClickMasters`,
    description: industry.metaDesc,
    alternates: { canonical },
    openGraph: {
      title: `${industry.title} | ClickMasters`,
      description: industry.metaDesc,
      url: canonical,
      images: [
        {
          url: `${siteConfig.url}/og/services.webp`,
          width: 1200,
          height: 630,
          alt: `${industry.title} ClickMasters software services`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${industry.title} | ClickMasters`,
      description: industry.metaDesc,
      images: [`${siteConfig.url}/og/services.webp`],
    },
  };
}

// ═══════════════════════════════════════════════════════════
// CUSTOM INDUSTRY COMPONENTS (Inline — no external dependencies)
// ═══════════════════════════════════════════════════════════

// Industry-specific FAQ Accordion
function IndustryFAQ({ faqs, industryName }) {
  if (!faqs?.length) return null;

  return (
    <section id="faq" className="scroll-mt-20 bg-surface py-16 md:py-24">
      <div className="mx-auto max-w-[96vw] lg:max-w-[90vw] px-5 md:px-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-1 rounded-full bg-accent" />
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="text-slate-500 leading-relaxed mb-10">
            Common questions about {industryName || 'this industry'} software development.
          </p>
        </div>

        <div className="max-w-3xl space-y-3">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="group rounded-xl border border-slate-200 bg-white overflow-hidden"
            >
              <summary className="flex items-center justify-between cursor-pointer p-5 list-none">
                <span className="font-semibold text-slate-800 pr-4">{faq.question}</span>
                <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all group-open:bg-accent group-open:text-white">
                  <svg className="h-3.5 w-3.5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="px-5 pb-5">
                <div className="h-px w-full bg-slate-100 mb-4" />
                <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// Industry-specific Pricing Cards
function IndustryPricing({ serviceName, pricingTiers, industryName }) {
  if (!pricingTiers?.length) return null;

  return (
    <section id="pricing" className="scroll-mt-20 py-16 md:py-24">
      <div className="mx-auto max-w-[96vw] lg:max-w-[90vw] px-5 md:px-8">
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-1 rounded-full bg-accent" />
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Investment Options
            </h2>
          </div>
          <p className="text-slate-500 leading-relaxed">
            Flexible engagement models tailored to your {industryName || 'industry'} project requirements.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pricingTiers.map((tier, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl border bg-white p-6 transition-all hover:shadow-xl hover:-translate-y-1 ${idx === 1
                ? 'border-accent shadow-lg shadow-accent/10'
                : 'border-slate-200 shadow-md'
                }`}
            >
              {idx === 1 && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
                  Most Popular
                </span>
              )}

              <div className="mb-4">
                <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
                  {tier.type}
                </span>
              </div>

              <p className="text-3xl font-bold text-slate-900 mb-1">
                {tier.investment || tier.price}
              </p>
              {tier.bestFor && (
                <p className="text-sm text-slate-500 mb-6">
                  {tier.bestFor}
                </p>
              )}

              <div className="h-px w-full bg-slate-100 mb-4" />

              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-slate-600">
                  <svg className="h-5 w-5 shrink-0 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Industry-specific approach</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-600">
                  <svg className="h-5 w-5 shrink-0 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>UK GDPR compliant</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-600">
                  <svg className="h-5 w-5 shrink-0 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Dedicated technical lead</span>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Industry-specific Testimonials
function IndustryTestimonials({ industryName }) {
  return (
    <section id="testimonials" className="scroll-mt-20 py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-[96vw] lg:max-w-[90vw] px-5 md:px-8">
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-1 rounded-full bg-accent" />
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              What Our Clients Say
            </h2>
          </div>
          <p className="text-slate-500 leading-relaxed">
            Success stories from clients in {industryName || 'this'} industry.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              quote: "ClickMasters transformed our digital infrastructure. Their understanding of UK fintech regulations saved us months of compliance work.",
              author: "Sarah Mitchell",
              role: "CTO",
              company: "FinTech Solutions Ltd",
              industry: "Fintech"
            },
            {
              quote: "The team's expertise in NHS integrations and DTAC compliance was invaluable. They delivered on time and within budget.",
              author: "Dr. James Cooper",
              role: "Medical Director",
              company: "HealthFirst UK",
              industry: "HealthTech"
            },
            {
              quote: "Their grasp of FCA requirements and insurance sector nuances helped us launch our platform 40% faster than expected.",
              author: "Michael Brooks",
              role: "CEO",
              company: "InsureTech Pro",
              industry: "InsurTech"
            }
          ].map((testimonial, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl border border-slate-200 bg-surface p-6 transition-all hover:shadow-lg hover:-translate-y-1"
            >
              {/* Quote icon */}
              <div className="absolute top-5 right-5 text-6xl font-serif text-accent/10 leading-none">
                &ldquo;
              </div>

              <div className="relative">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-slate-600 leading-relaxed mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-accent to-accent-hover text-white font-bold">
                    {testimonial.author[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{testimonial.author}</p>
                    <p className="text-xs text-slate-500">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main Page Component
export default async function IndustryDetailPage({ params }) {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);

  if (!industry) notFound();

  const canonicalPath = `/industries/${industry.slug}`;
  const url = `${siteConfig.url}${canonicalPath}`;
  const faqs = industry.faqs || [];
  const sections = industry.sections || [];
  const pricingTiers = industry.pricingTiers || [];
  const compliance = industry.compliance || [];
  const related = getRelatedIndustries(slug, 3);

  const serviceJsonLd = serviceSchema(industry.title, industry.metaDesc, url);
  const faqJsonLd = faqSchema(faqs);

  return (
    <>
      <JsonLd schema={serviceJsonLd} />
      {faqs.length > 0 && <JsonLd schema={faqJsonLd} />}
      <JsonLd schema={breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Industries', url: '/industries' },
        { name: industry.title, url: canonicalPath },
      ])} />

      <div className="min-h-screen text-primary relative overflow-x-hidden">
        {/* ═══════════════════════════════════════════════════════════
            INDUSTRY HERO — Compact, editorial, info-dense
            ═══════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-primary">
          {/* Dot pattern */}
          <div className="absolute inset-0 opacity-[0.04]" aria-hidden>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                backgroundSize: '28px 28px',
              }}
            />
          </div>
          <div className="absolute -top-32 right-0 h-80 w-80 rounded-full bg-accent/12 blur-[120px]" aria-hidden />
          <div className="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-accent/8 blur-[100px]" aria-hidden />

          <div className="relative mx-auto max-w-[96vw] lg:max-w-[90vw] px-5 pt-28 pb-16 md:pt-36 md:pb-20">
            {/* Breadcrumb */}
            <nav className="mb-8 flex items-center gap-1.5 text-sm">
              <Link href="/" className="text-white/40 hover:text-white/70 transition-colors">
                Home
              </Link>
              <svg className="h-3 w-3 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
              <Link href="/industries" className="text-white/40 hover:text-white/70 transition-colors">
                Industries
              </Link>
              <svg className="h-3 w-3 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
              <span className="text-white/80 font-medium">{industry.title}</span>
            </nav>

            <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
              {/* Left — Main copy */}
              <div>
                <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-accent backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {industry.industry || 'Industry'} Solutions
                </span>

                <h1 className="font-heading text-3xl font-bold leading-[1.15] text-white sm:text-4xl lg:text-[2.75rem]">
                  {industry.title}
                </h1>

                {industry.directAnswer && (
                  <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/55">
                    {industry.directAnswer}
                  </p>
                )}

                {/* Meta info bar */}
                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/40">
                  {industry.lastUpdated && (
                    <span className="flex items-center gap-1.5">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      Updated {industry.lastUpdated}
                    </span>
                  )}
                  {industry.readingTime && (
                    <span className="flex items-center gap-1.5">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                      </svg>
                      {industry.readingTime} min read
                    </span>
                  )}
                  {industry.writtenBy && (
                    <span className="flex items-center gap-1.5">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                      By {industry.writtenBy}
                    </span>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent-hover hover:-translate-y-0.5"
                  >
                    Get Free Consultation
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  {pricingTiers.length > 0 && (
                    <a
                      href="#pricing"
                      className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
                    >
                      View Pricing
                    </a>
                  )}
                </div>
              </div>

              {/* Right — Info card stack */}
              <div className="space-y-4">
                {/* Badges card */}
                {industry.badges && industry.badges.length > 0 && (
                  <div className="rounded-xl border border-white/10 bg-white/4 p-5 backdrop-blur-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
                      Key Highlights
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {industry.badges.map((badge, bi) => (
                        <span
                          key={bi}
                          className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Compliance quick-view */}
                {compliance.length > 0 && (
                  <div className="rounded-xl border border-white/10 bg-white/4 p-5 backdrop-blur-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
                      Compliance
                    </p>
                    <div className="mt-3 space-y-2">
                      {compliance.slice(0, 4).map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-white/60">
                          <svg className="h-3.5 w-3.5 shrink-0 text-accent" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {typeof item === 'string' ? item : (item.name || item.title || '')}
                        </div>
                      ))}
                      {compliance.length > 4 && (
                        <p className="text-xs text-white/30">
                          +{compliance.length - 4} more standards
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Pricing quick-view */}
                {pricingTiers.length > 0 && (
                  <div className="rounded-xl border border-white/10 bg-white/4 p-5 backdrop-blur-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
                      Pricing
                    </p>
                    <div className="mt-3 space-y-2">
                      {pricingTiers.slice(0, 3).map((tier, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-white/60">{tier.type}</span>
                          <span className="font-semibold text-accent">{tier.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-white to-transparent" aria-hidden />
        </section>

        {/* ═══════════════════════════════════════════════════════════
            TABLE OF CONTENTS — Sticky horizontal scroll
            ═══════════════════════════════════════════════════════════ */}
        <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
          <div className="mx-auto max-w-[96vw] lg:max-w-[90vw] px-5 md:px-8">
            <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
              <Link
                href="#overview"
                className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                Overview
              </Link>
              {sections.map((sec, i) => {
                const id = slugify(sec.heading);
                return (
                  <a
                    key={i}
                    href={`#${id}`}
                    className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  >
                    {sec.heading.length > 30 ? sec.heading.slice(0, 30) + '…' : sec.heading}
                  </a>
                );
              })}
              {compliance.length > 0 && (
                <a href="#compliance" className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900">
                  Compliance
                </a>
              )}
              {pricingTiers.length > 0 && (
                <a href="#pricing" className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900">
                  Pricing
                </a>
              )}
              {faqs.length > 0 && (
                <a href="#faq" className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900">
                  FAQ
                </a>
              )}
            </div>
          </div>
        </div>

        <div id="overview" className="scroll-mt-20" />

        {/* ═══════════════════════════════════════════════════════════
            INDUSTRY SECTIONS — Bold-led editorial content
            ═══════════════════════════════════════════════════════════ */}
        {sections.length > 0 && (
          <IndustrySections sections={sections} serviceName={industry.title} />
        )}

        {/* ═══════════════════════════════════════════════════════════
            COMPLIANCE — Full section with cards
            ═══════════════════════════════════════════════════════════ */}
        {compliance.length > 0 && (
          <section id="compliance" className="scroll-mt-20 bg-surface py-16 md:py-20">
            <div className="mx-auto max-w-[96vw] lg:max-w-[90vw] px-5 md:px-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-1 rounded-full bg-accent" />
                <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                  Compliance & Regulations
                </h2>
              </div>
              <p className="mt-3 max-w-2xl text-base text-slate-500">
                Every solution we build for this industry is designed to meet the following
                regulatory and standards requirements.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {compliance.map((item, i) => (
                  <div
                    key={i}
                    className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        {typeof item === 'string' ? (
                          <p className="text-sm font-semibold text-slate-800">{item}</p>
                        ) : (
                          <>
                            <p className="text-sm font-semibold text-slate-800">
                              {item.name || item.title || ''}
                            </p>
                            {item.description && (
                              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                                {item.description}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════
            PRICING — Industry-specific component
            ═══════════════════════════════════════════════════════════ */}
        {pricingTiers.length > 0 && (
          <IndustryPricing
            serviceName={industry.title}
            industryName={industry.industry}
            pricingTiers={pricingTiers.map((t) => ({
              type: t.type,
              investment: t.price,
              timeline: t.timeline,
              bestFor: t.scope,
            }))}
          />
        )}

        {/* ═══════════════════════════════════════════════════════════
            TESTIMONIALS — Industry-specific component
            ═══════════════════════════════════════════════════════════ */}
        <IndustryTestimonials industryName={industry.industry} />

        {/* ═══════════════════════════════════════════════════════════
            FAQ — Industry-specific component
            ═══════════════════════════════════════════════════════════ */}
        {faqs.length > 0 && <IndustryFAQ faqs={faqs} industryName={industry.industry} />}

        {/* ═══════════════════════════════════════════════════════════
            RELATED INDUSTRIES
            ═══════════════════════════════════════════════════════════ */}
        {related.length > 0 && (
          <section className="bg-surface border-t border-slate-200 py-16 md:py-20">
            <div className="mx-auto max-w-[96vw] lg:max-w-[90vw] px-5 md:px-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-1 rounded-full bg-accent" />
                <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                  Related {industry.industry || 'Industry'} Services
                </h2>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/industries/${rel.slug}`}
                    className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-accent/25"
                  >
                    <p className="text-base font-semibold text-slate-900 group-hover:text-accent transition-colors">
                      {rel.title}
                    </p>
                    {rel.badges && rel.badges.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {rel.badges.slice(0, 3).map((badge, bi) => (
                          <span
                            key={bi}
                            className="inline-block rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-accent">
                      Learn more
                      <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════
            CTA
            ═══════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-primary py-20">
          <div className="absolute inset-0 opacity-[0.03]" aria-hidden>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                backgroundSize: '32px 32px',
              }}
            />
          </div>
          <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-accent/10 blur-[100px]" aria-hidden />

          <div className="relative mx-auto max-w-3xl px-5 text-center md:px-8">
            <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
              Ready to Build for{' '}
              <span className="text-accent">{industry.industry || 'Your Industry'}?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/55">
              Let us engineer a platform that meets your industry regulations, serves your
              users, and scales with your ambitions.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-hover hover:-translate-y-0.5"
              >
                Book Free Consultation
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/industries"
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
              >
                View All Industries
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}