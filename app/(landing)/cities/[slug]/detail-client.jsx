'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Clock,
  MapPin,
  CheckCircle,
  MessageSquare,
  BookOpen,
  Building2,
  User,
  ExternalLink,
  Shield,
  Zap,
} from 'lucide-react';

export function CityDetailClient({ city, relatedCities }) {
  const [openFaq, setOpenFaq] = useState(null);

  const {
    title,
    city: cityName,
    lastUpdated,
    readingTime,
    writtenBy,
    reviewedBy,
    badges = [],
    directAnswer,
    benefits = [],
    ecosystem,
    pricingTable,
    complianceTable,
    processSteps = [],
    faqs = [],
    relatedPages = [],
    cta,
    author,
  } = city;

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const cityDisplay = cityName.charAt(0).toUpperCase() + cityName.slice(1).replace(/-/g, ' ');

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="absolute inset-0 bg-linear-to-br from-primary via-primary-mid to-primary-light" />
        <div className="absolute top-10 right-[5%] w-150 h-150 rounded-full bg-accent/8 blur-3xl" />
        <div className="absolute bottom-0 left-[10%] w-[350px] h-[350px] rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative max-w-[96vw] lg:max-w-[90vw] mx-auto px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/cities" className="hover:text-white transition-colors">City Guides</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/90 truncate max-w-[200px] md:max-w-[none]">
              {cityDisplay}
            </span>
          </nav>

          <div className="max-w-7xl">
            <span className="section-label mb-5 bg-white/10 border-white/15 text-white/80">
              <MapPin className="w-3 h-3 mr-1.5 inline -mt-0.5" />
              {cityDisplay}
            </span>

            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-white/60 mb-4">
              {lastUpdated && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  Updated: {lastUpdated}
                </span>
              )}
              {readingTime > 0 && (
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  {readingTime} min read
                </span>
              )}
            </div>

            {badges.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-8">
                {badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/10 border border-white/20 text-white/80"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Direct Answer ── */}
      {directAnswer && (
        <section className="border-b border-border bg-white">
          <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto px-6 py-8 md:py-10">
            <div className="max-w-4xl">
              <span className="section-label mb-4 text-accent border-accent/20">Direct Answer</span>
              <p className="text-lg md:text-xl text-text-body leading-relaxed font-body">
                {directAnswer}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── Benefits / Why Choose ── */}
      {benefits.length > 0 && (
        <section className="border-b border-border bg-surface">
          <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto px-6 py-12 md:py-16">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary mb-8">
              Why {cityDisplay} Businesses Choose ClickMasters
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white rounded-xl border border-border p-5 shadow-xs">
                  <CheckCircle className="w-5 h-5 shrink-0 text-accent mt-0.5" />
                  <span className="text-text-body text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Ecosystem ── */}
      {ecosystem && (
        <section className="border-b border-border bg-white">
          <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto px-6 py-12 md:py-16">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary mb-6">
              The {cityDisplay} Technology Ecosystem
            </h2>
            <div className="max-w-4xl">
              {ecosystem.split('\n\n').map((paragraph, pIdx) => (
                <p key={pIdx} className="text-text-body leading-relaxed mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Pricing Table ── */}
      {pricingTable && pricingTable.rows.length > 0 && (
        <section className="border-b border-border bg-surface">
          <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto px-6 py-12 md:py-16">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary mb-8">
              Pricing for {cityDisplay} Businesses
            </h2>
            <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
              <table className="w-full text-sm md:text-base">
                {pricingTable.headers.length > 0 && (
                  <thead>
                    <tr className="bg-primary-mid/5">
                      {pricingTable.headers.map((header, hIdx) => (
                        <th key={hIdx} className={`px-4 md:px-6 py-3 md:py-4 text-left font-heading font-bold text-text-primary text-xs md:text-sm uppercase tracking-wider ${hIdx > 0 ? 'border-l border-border' : ''}`}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {pricingTable.rows.map((row, rIdx) => (
                    <tr key={rIdx} className={`${rIdx % 2 === 1 ? 'bg-surface/50' : 'bg-white'} hover:bg-accent/5 transition-colors`}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className={`px-4 md:px-6 py-3 md:py-4 text-text-body ${cIdx === 0 ? 'font-semibold text-text-primary' : ''} ${cIdx > 0 ? 'border-l border-border' : ''}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ── Compliance Table ── */}
      {complianceTable && complianceTable.rows.length > 0 && (
        <section className="border-b border-border bg-white">
          <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto px-6 py-12 md:py-16">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary mb-8">
              <Shield className="w-6 h-6 inline mr-2 text-accent" />
              UK Compliance for {cityDisplay} Projects
            </h2>
            <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
              <table className="w-full text-sm md:text-base">
                {complianceTable.headers.length > 0 && (
                  <thead>
                    <tr className="bg-primary-mid/5">
                      {complianceTable.headers.map((header, hIdx) => (
                        <th key={hIdx} className={`px-4 md:px-6 py-3 md:py-4 text-left font-heading font-bold text-text-primary text-xs md:text-sm uppercase tracking-wider ${hIdx > 0 ? 'border-l border-border' : ''}`}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {complianceTable.rows.map((row, rIdx) => (
                    <tr key={rIdx} className={`${rIdx % 2 === 1 ? 'bg-surface/50' : 'bg-white'} hover:bg-accent/5 transition-colors`}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className={`px-4 md:px-6 py-3 md:py-4 text-text-body text-sm ${cIdx === 0 ? 'font-semibold text-text-primary' : ''} ${cIdx > 0 ? 'border-l border-border' : ''}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ── Process Steps ── */}
      {processSteps.length > 0 && (
        <section className="border-b border-border bg-surface">
          <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto px-6 py-12 md:py-16">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary mb-8">
              How We Work with {cityDisplay} Businesses
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {processSteps.map((step) => (
                <div key={step.step} className="bg-white rounded-xl border border-border p-5 shadow-xs hover:shadow-md transition-all">
                  <div className="w-8 h-8 rounded-lg bg-accent text-white font-bold text-sm flex items-center justify-center mb-3">
                    {step.step}
                  </div>
                  <h3 className="font-heading font-bold text-text-primary text-sm mb-2">{step.title}</h3>
                  <p className="text-text-muted text-xs leading-relaxed">{step.description.substring(0, 200)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Frequently Asked Questions ── */}
      {faqs.length > 0 && (
        <section className="border-b border-border bg-[#0b1a2e]">
          <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto px-6 py-12 md:py-16">
            <div className="max-w-4xl mx-auto">
              <span className="section-label mb-6 bg-white/10 border-white/15 text-white/80">
                <MessageSquare className="w-3 h-3 mr-1.5 inline -mt-0.5" />
                Frequently Asked Questions
              </span>

              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden transition-all duration-250">
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between px-6 py-4 md:py-5 text-left"
                    >
                      <span className="font-heading font-bold text-white pr-4 text-sm md:text-base">
                        {faq.question.replace(/^:\s*/, '')}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-accent shrink-0 transition-transform duration-250 ${openFaq === idx ? 'rotate-180' : ''}`} />
                    </button>
                    {openFaq === idx && (
                      <div className="px-6 pb-4 md:pb-5">
                        <p className="text-white/70 leading-relaxed text-sm md:text-base">
                          {faq.answer.replace(/^:\s*/, '')}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Author & Related Pages ── */}
      <section className="border-b border-border bg-white">
        <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto px-6 py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {author && (
              <div>
                <span className="section-label mb-4 text-accent border-accent/20">
                  <User className="w-3 h-3 mr-1.5 inline -mt-0.5" />
                  Author
                </span>
                <p className="text-text-body font-semibold">{author}</p>
                {writtenBy && <p className="text-text-muted text-sm mt-1">{writtenBy}</p>}
                {reviewedBy && (
                  <p className="text-text-muted text-sm mt-1">
                    <CheckCircle className="w-3 h-3 inline mr-1 text-accent" />
                    {reviewedBy}
                  </p>
                )}
              </div>
            )}

            {relatedPages.length > 0 && (
              <div>
                <span className="section-label mb-4 text-accent border-accent/20">
                  <ExternalLink className="w-3 h-3 mr-1.5 inline -mt-0.5" />
                  Related Resources
                </span>
                <ul className="space-y-2">
                  {relatedPages.map((page, idx) => (
                    <li key={idx}>
                      <Link href={`/${page.slug}`} className="flex items-center gap-2 text-text-body hover:text-accent transition-colors text-sm">
                        <ChevronRight className="w-3.5 h-3.5 shrink-0 text-accent" />
                        {page.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Related Cities ── */}
      {relatedCities.length > 0 && (
        <section className="py-16 px-6 bg-surface">
          <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="section-label mb-3 text-accent border-accent/20">
                  <MapPin className="w-3 h-3 mr-1.5 inline -mt-0.5" />
                  Other Cities
                </span>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary">
                  Explore Other City Guides
                </h2>
              </div>
              <Link href="/cities" className="hidden md:flex items-center gap-2 text-sm font-semibold text-accent hover:gap-3 transition-all">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedCities.map((rc, idx) => (
                <Link
                  key={rc.id}
                  href={`/cities/${rc.slug}`}
                  className="group bg-white rounded-xl border border-border hover:border-accent hover:-translate-y-1 transition-all duration-250 shadow-xs hover:shadow-md p-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-accent" />
                    <span className="font-heading font-bold text-text-primary text-sm">{rc.city.charAt(0).toUpperCase() + rc.city.slice(1).replace(/-/g, ' ')}</span>
                  </div>
                  <p className="text-xs text-text-muted line-clamp-2">{rc.metaDesc?.substring(0, 100)}</p>
                  <div className="flex items-center gap-1 text-xs font-semibold text-accent mt-3 group-hover:gap-1.5 transition-all">
                    View Guide <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Bottom CTA ── */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary via-primary-mid to-primary-light px-8 py-16 md:px-16 md:py-20 text-center">
            <div className="absolute top-0 right-0 w-75 h-75 rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-63 h-63 rounded-full bg-accent/5 blur-3xl" />
            <div className="relative">
              <span className="section-label mb-6 bg-white/10 border-white/15 text-white/80">Start Your Project</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">Ready to Build in {cityDisplay}?</h2>
              <p className="text-white/60 max-w-xl mx-auto mb-10 text-lg">Book a free consultation with a senior engineer. We'll scope your project, give you transparent pricing, and answer your compliance questions.</p>
              <Link href="/contact" className="btn-primary inline-flex items-center justify-center gap-2 text-base px-10 py-4">
                Book Free Consultation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
