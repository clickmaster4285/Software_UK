'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  MapPin,
  Shield,
  CheckCircle,
  Clock,
  Users,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Star,
  Zap,
  MessageSquare,
} from 'lucide-react';

export function HireDetailClient({ hirePage, relatedPages }) {
  const [openFaq, setOpenFaq] = useState(null);

  const {
    title,
    metaTitle,
    metaDesc,
    cityDisplay,
    rate,
    rates,
    directAnswer,
    benefits = [],
    skills = [],
    vettingProcess = [],
    faqs = [],
    lastUpdated,
    readingTime,
  } = hirePage;

  const cityName = cityDisplay
    ? cityDisplay.charAt(0).toUpperCase() + cityDisplay.slice(1)
    : '';

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-mid to-primary-light" />
        <div className="absolute top-10 right-[5%] w-[600px] h-[600px] rounded-full bg-accent/8 blur-3xl" />
        <div className="absolute bottom-0 left-[10%] w-[350px] h-[350px] rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative max-w-[96vw] lg:max-w-[90vw] mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/hire" className="hover:text-white transition-colors">Hire Developers</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/90">{cityName}</span>
          </nav>

          <div className="max-w-3xl">
            <span className="section-label mb-5 bg-white/10 border-white/15 text-white/80">
              <MapPin className="w-3 h-3 mr-1.5 inline -mt-0.5" />
              {cityName}, UK
            </span>

            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {title}
            </h1>

            {/* Quick info badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              {rate && (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.1] border border-white/[0.15] text-white text-sm backdrop-blur-sm">
                  <Zap className="w-4 h-4 text-accent" />
                  From {rate}
                </span>
              )}
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.1] border border-white/[0.15] text-white text-sm backdrop-blur-sm">
                <Shield className="w-4 h-4 text-accent" />
                Zero IR35 Risk
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.1] border border-white/[0.15] text-white text-sm backdrop-blur-sm">
                <CheckCircle className="w-4 h-4 text-accent" />
                3-Stage Vetting
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.1] border border-white/[0.15] text-white text-sm backdrop-blur-sm">
                <Clock className="w-4 h-4 text-accent" />
                30-Day Rolling
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="btn-primary inline-flex items-center justify-center gap-2 text-base px-8 py-4"
              >
                Start Hiring
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#rates"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white rounded-lg font-medium hover:bg-white/10 transition-colors text-base"
              >
                View Rates
              </Link>
            </div>
          </div>

          {/* Meta info */}
          {lastUpdated && (
            <p className="mt-8 text-sm text-white/40">
              Last updated: {lastUpdated} • {readingTime || 8} min read
            </p>
          )}
        </div>
      </section>

      {/* ── Direct Answer ── */}
      {directAnswer && (
        <section className="py-14 px-6 border-b border-border">
          <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
            <div className="max-w-3xl mx-auto relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/[0.04] to-transparent p-8">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-accent/5 blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-accent" />
                  <h2 className="font-heading text-lg font-semibold text-text-primary">Quick Answer</h2>
                </div>
                <p className="text-text-body leading-relaxed">{directAnswer}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Benefits ── */}
      {benefits.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
            <div className="max-w-3xl mx-auto">
              <span className="section-label mb-4">Why {cityName} Businesses Choose Us</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Why Hire Through ClickMasters?
              </h2>
              <p className="text-text-muted mb-10 max-w-2xl">
                Every developer we place is an employee of ClickMasters — not a contractor.
                That distinction changes everything.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="group flex gap-4 p-6 bg-white rounded-2xl border border-border transition-all duration-300 hover:border-accent/25 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
                  >
                    <div className="shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/15 transition-colors">
                      <CheckCircle className="w-5 h-5 text-accent" />
                    </div>
                    <p className="text-text-body leading-relaxed pt-1.5">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Rates Table ── */}
      {rates && (rates.mid || rates.senior || rates.lead) && (
        <section id="rates" className="py-20 px-6 bg-surface">
          <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
            <div className="max-w-3xl mx-auto">
              <span className="section-label mb-4">Transparent Pricing</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-primary mb-4">
                {cityName} Developer Rates — 2025 Pricing
              </h2>
              <p className="text-text-muted mb-10">
                All rates are monthly, per developer. No hidden fees. No IR35 surcharges.
              </p>

              <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
                {/* Table header */}
                <div className="grid grid-cols-4 bg-primary text-white">
                  <div className="p-5 font-heading font-semibold text-sm">Engagement</div>
                  <div className="p-5 font-heading font-semibold text-sm text-center">Mid-Level</div>
                  <div className="p-5 font-heading font-semibold text-sm text-center">Senior</div>
                  <div className="p-5 font-heading font-semibold text-sm text-center">Tech Lead</div>
                </div>

                {/* Monthly Rate */}
                <div className="grid grid-cols-4 border-b border-border">
                  <div className="p-5 text-sm text-text-body font-medium">Monthly Rate</div>
                  <div className="p-5 text-center font-heading font-bold text-accent">{rates.mid || 'POA'}</div>
                  <div className="p-5 text-center font-heading font-bold text-accent">{rates.senior || 'POA'}</div>
                  <div className="p-5 text-center font-heading font-bold text-accent">{rates.lead || 'POA'}</div>
                </div>

                {/* IR35 */}
                <div className="grid grid-cols-4 border-b border-border bg-surface/50">
                  <div className="p-5 text-sm text-text-body font-medium">IR35 Position</div>
                  <div className="p-5 text-center text-sm text-text-muted">N/A — Employees</div>
                  <div className="p-5 text-center text-sm text-text-muted">N/A — Employees</div>
                  <div className="p-5 text-center text-sm text-text-muted">N/A — Employees</div>
                </div>

                {/* Contract */}
                <div className="grid grid-cols-4 border-b border-border">
                  <div className="p-5 text-sm text-text-body font-medium">Contract</div>
                  <div className="p-5 text-center text-sm text-text-muted">30-day rolling</div>
                  <div className="p-5 text-center text-sm text-text-muted">30-day rolling</div>
                  <div className="p-5 text-center text-sm text-text-muted">30-day rolling</div>
                </div>

                {/* Replacement */}
                <div className="grid grid-cols-4 bg-surface/50">
                  <div className="p-5 text-sm text-text-body font-medium">Replacement</div>
                  <div className="p-5 text-center text-sm text-text-muted">2 weeks</div>
                  <div className="p-5 text-center text-sm text-text-muted">2 weeks</div>
                  <div className="p-5 text-center text-sm text-text-muted">2 weeks</div>
                </div>
              </div>

              <p className="mt-4 text-xs text-text-muted text-center">
                All developers are ClickMasters employees. Zero IR35 liability for your business.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── Skills ── */}
      {skills.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
            <div className="max-w-3xl mx-auto">
              <span className="section-label mb-4">Technical Skills</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-primary mb-8">
                What Our Developers Know
              </h2>

              <div className="flex flex-wrap gap-2.5">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2.5 bg-surface rounded-full text-sm text-text-body border border-border hover:border-accent/30 hover:bg-accent/5 transition-all duration-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Vetting Process ── */}
      {vettingProcess.length > 0 && (
        <section className="py-20 px-6 bg-surface">
          <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
            <div className="max-w-3xl mx-auto">
              <span className="section-label mb-4">Our Vetting Process</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Every Developer. Three Stages. No Exceptions.
              </h2>
              <p className="text-text-muted mb-10 max-w-2xl">
                We don't just check CVs. Every developer goes through our rigorous 3-stage process
                before they're presented to you.
              </p>

              <div className="space-y-5">
                {vettingProcess.map((stage, index) => (
                  <div
                    key={index}
                    className="relative flex gap-5 p-7 bg-white rounded-2xl border border-border transition-all duration-300 hover:border-accent/25 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
                  >
                    {/* Step number */}
                    <div className="shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center">
                        <span className="font-heading font-bold text-white text-lg">
                          {stage.stage || index + 1}
                        </span>
                      </div>
                      {index < vettingProcess.length - 1 && (
                        <div className="absolute left-[2.15rem] top-[4.5rem] bottom-[-1.25rem] w-px bg-border" />
                      )}
                    </div>

                    <div className="pt-1">
                      <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
                        {stage.title}
                      </h3>
                      <p className="text-text-body text-sm leading-relaxed">
                        {stage.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── FAQs ── */}
      {faqs.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
            <div className="max-w-3xl mx-auto">
              <span className="section-label mb-4">FAQs</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-text-muted mb-10">
                Everything you need to know about hiring in {cityName}.
              </p>

              <div className="space-y-3">
                {faqs.map((faq, index) => {
                  const isOpen = openFaq === index;
                  const question = faq.question.replace(/^:\s*/, '');
                  const answer = faq.answer.replace(/^:\s*/, '');

                  return (
                    <div
                      key={index}
                      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                        isOpen
                          ? 'border-accent/30 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]'
                          : 'border-border bg-white hover:border-accent/20'
                      }`}
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
                      >
                        <span className={`font-heading font-semibold pr-4 transition-colors duration-200 ${
                          isOpen ? 'text-accent' : 'text-text-primary'
                        }`}>
                          {question}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
                            isOpen ? 'rotate-180 text-accent' : 'text-text-muted'
                          }`}
                        />
                      </button>
                      <div
                        className={`transition-all duration-300 ease-in-out ${
                          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        } overflow-hidden`}
                      >
                        <div className="px-6 pb-6">
                          <div className="pl-4 border-l-2 border-accent/30">
                            <p className="text-text-body text-sm leading-relaxed">
                              {answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Related Cities ── */}
      {relatedPages.length > 0 && (
        <section className="py-20 px-6 bg-surface">
          <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
            <div className="max-w-3xl mx-auto">
              <span className="section-label mb-4">Other Locations</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Hire in Other Cities
              </h2>
              <p className="text-text-muted mb-8">
                Same vetting. Same quality. Different location.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {relatedPages.map((rp) => (
                  <Link
                    key={rp.slug}
                    href={`/hire/${rp.role}/${rp.city}`}
                    className="group flex items-center gap-3 p-4 bg-white rounded-xl border border-border hover:border-accent/30 transition-all duration-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
                  >
                    <MapPin className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors shrink-0" />
                    <span className="text-sm font-medium text-text-body group-hover:text-accent transition-colors">
                      {rp.cityDisplay.charAt(0).toUpperCase() + rp.cityDisplay.slice(1)}
                    </span>
                    <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors ml-auto shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-20 px-6">
        <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-mid to-primary-light px-8 py-14 md:px-14 md:py-18 text-center">
              <div className="absolute top-0 right-0 w-[250px] h-[250px] rounded-full bg-accent/10 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full bg-accent/5 blur-3xl" />

              <div className="relative">
                <span className="section-label mb-6 bg-white/10 border-white/15 text-white/80">
                  <Sparkles className="w-3 h-3 mr-1.5 inline -mt-0.5" />
                  Ready to Hire?
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
                  Hire a Developer in {cityName}
                </h2>
                <p className="text-white/70 max-w-lg mx-auto mb-10 text-lg">
                  30-minute team-planning call. Tell us the role, we give you timeline,
                  rates, and IR35 clarity.
                </p>
                <Link
                  href="/contact"
                  className="btn-primary inline-flex items-center justify-center gap-2 text-base px-10 py-4"
                >
                  Start Hiring
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
