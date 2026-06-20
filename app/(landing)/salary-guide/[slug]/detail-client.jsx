'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  MapPin,
  Shield,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Zap,
  MessageSquare,
  TrendingUp,
  Calendar,
  BookOpen,
} from 'lucide-react';

export function SalaryGuideDetailClient({ guide, relatedGuides }) {
  const [openFaq, setOpenFaq] = useState(null);

  const {
    title,
    role,
    year,
    lastUpdated,
    readingTime,
    writtenBy,
    reviewedBy,
    badges = [],
    directAnswer,
    introText,
    experienceTable,
    cityTable,
    generalRoleSalaryTable,
    techStackPremiums,
    contractorRates,
    faqs = [],
  } = guide;

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

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
            <Link href="/salary-guide" className="hover:text-white transition-colors">Salary Benchmarks</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/90 truncate max-w-[200px] md:max-w-[none]">
              {title.replace(/— Permanent.*/, '')}
            </span>
          </nav>

          <div className="max-w-7xl">
            <span className="section-label mb-5 bg-white/10 border-white/15 text-white/80">
              <Calendar className="w-3 h-3 mr-1.5 inline -mt-0.5" />
              UK Tech Market Guide — {year}
            </span>

            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {title}
            </h1>

            {/* Badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              {badges.map((badge, idx) => (
                <span key={idx} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.1] border border-white/[0.15] text-white text-sm backdrop-blur-sm">
                  {badge}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="btn-primary inline-flex items-center justify-center gap-2 text-base px-8 py-4"
              >
                Hire Developers at Market Rate
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#rates"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white rounded-lg font-medium hover:bg-white/10 transition-colors text-base"
              >
                View Benchmarks
              </Link>
            </div>
          </div>

          {lastUpdated && (
            <p className="mt-8 text-sm text-white/40 font-body">
              Last updated: {lastUpdated} • {readingTime || 7} min read {writtenBy ? `• Written by: ${writtenBy}` : ''} {reviewedBy ? `• Reviewed by: ${reviewedBy}` : ''}
            </p>
          )}
        </div>
      </section>

      {/* ── Direct Answer ── */}
      {directAnswer && (
        <section className="py-14 px-6 border-b border-border bg-background">
          <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
            <div className="max-w-7xl mx-auto relative overflow-hidden rounded-2xl border border-accent/20 bg-linear-to-br from-accent/4 to-transparent p-8">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-accent/5 blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-accent" />
                  <h2 className="font-heading text-lg font-semibold text-text-primary">Direct Answer</h2>
                </div>
                <p className="text-text-body leading-relaxed font-body text-base md:text-lg">{directAnswer}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Main Details ── */}
      <section id="rates" className="py-20 px-6 bg-surface">
        <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
          <div className="max-w-7xl mx-auto">
            {introText && (
              <div className="prose max-w-4xl mb-14">
                <h2 className="font-heading text-2xl font-bold text-text-primary mb-4">Market Outlook</h2>
                <p className="text-text-body leading-relaxed font-body text-base md:text-lg">{introText}</p>
              </div>
            )}

            {/* ── Tier A: General Role Salary Table ── */}
            {generalRoleSalaryTable && (
              <div className="mb-14">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  <h3 className="font-heading text-xl font-bold text-text-primary">
                    UK Technology Salaries by Role
                  </h3>
                </div>
                <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-xs overflow-x-auto">
                  <div className="min-w-200">
                    <div className="grid grid-cols-5 bg-primary text-white font-heading font-semibold text-sm">
                      <div className="p-5">Role</div>
                      <div className="p-5 text-center">Junior (0–2 yrs)</div>
                      <div className="p-5 text-center">Mid-Level (3–5 yrs)</div>
                      <div className="p-5 text-center">Senior (6–10 yrs)</div>
                      <div className="p-5 text-center">Principal / Lead (10+ yrs)</div>
                    </div>
                    {generalRoleSalaryTable.map((row, idx) => (
                      <div key={idx} className={`grid grid-cols-5 border-b border-border text-sm font-body ${idx % 2 === 1 ? 'bg-surface/50' : ''}`}>
                        <div className="p-5 font-semibold text-text-primary flex items-center">{row.role}</div>
                        <div className="p-5 text-center text-text-body flex items-center justify-center">{row.junior}</div>
                        <div className="p-5 text-center text-text-body flex items-center justify-center">{row.mid}</div>
                        <div className="p-5 text-center font-semibold text-accent flex items-center justify-center">{row.senior}</div>
                        <div className="p-5 text-center text-text-body flex items-center justify-center">{row.principal}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Tier B/C: Experience Salary Table ── */}
            {experienceTable && (
              <div className="mb-14">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  <h3 className="font-heading text-xl font-bold text-text-primary">
                    Salary benchmarks by Seniority
                  </h3>
                </div>
                <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-xs">
                  <div className="grid grid-cols-4 bg-primary text-white font-heading font-semibold text-sm">
                    <div className="p-5">Seniority</div>
                    <div className="p-5 text-center">Permanent Salary</div>
                    <div className="p-5 text-center">Day Rate (Outside IR35)</div>
                    <div className="p-5 text-center">Annual Equivalent</div>
                  </div>
                  {experienceTable.map((row, idx) => (
                    <div key={idx} className={`grid grid-cols-4 border-b border-border text-sm font-body ${idx % 2 === 1 ? 'bg-surface/50' : ''}`}>
                      <div className="p-5 font-semibold text-text-primary flex items-center">{row.seniority}</div>
                      <div className="p-5 text-center text-text-body flex items-center justify-center">{row.permanent}</div>
                      <div className="p-5 text-center font-semibold text-accent flex items-center justify-center">{row.dayRate}</div>
                      <div className="p-5 text-center text-text-muted flex items-center justify-center">{row.annualEquiv}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Tier B: City Benchmark Table ── */}
            {cityTable && (
              <div className="mb-14">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-accent" />
                  <h3 className="font-heading text-xl font-bold text-text-primary">
                    Salary Benchmarks by UK City
                  </h3>
                </div>
                <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-xs">
                  <div className="grid grid-cols-12 bg-primary text-white font-heading font-semibold text-sm">
                    <div className="p-5 col-span-3">City</div>
                    <div className="p-5 text-center col-span-3">vs National Average</div>
                    <div className="p-5 text-center col-span-3">Salary Range</div>
                    <div className="p-5 col-span-3">Notes</div>
                  </div>
                  {cityTable.map((row, idx) => (
                    <div key={idx} className={`grid grid-cols-12 border-b border-border text-sm font-body ${idx % 2 === 1 ? 'bg-surface/50' : ''}`}>
                      <div className="p-5 font-semibold text-text-primary col-span-3 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-text-muted shrink-0" />
                        {row.city}
                      </div>
                      <div className="p-5 text-center text-text-body col-span-3 flex items-center justify-center">{row.vsAverage}</div>
                      <div className="p-5 text-center font-semibold text-accent col-span-3 flex items-center justify-center">{row.range}</div>
                      <div className="p-5 text-text-muted col-span-3 flex items-center">{row.notes}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Tier A: Technology Stack Premiums ── */}
            {techStackPremiums && (
              <div className="mb-14">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <h3 className="font-heading text-xl font-bold text-text-primary">
                    Skill-Based Technology Premiums
                  </h3>
                </div>
                <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-xs">
                  <div className="grid grid-cols-12 bg-primary text-white font-heading font-semibold text-sm">
                    <div className="p-5 col-span-4">Technology / Specialisation</div>
                    <div className="p-5 text-center col-span-3">Salary Premium</div>
                    <div className="p-5 col-span-5">Market Context</div>
                  </div>
                  {techStackPremiums.map((row, idx) => (
                    <div key={idx} className={`grid grid-cols-12 border-b border-border text-sm font-body ${idx % 2 === 1 ? 'bg-surface/50' : ''}`}>
                      <div className="p-5 font-semibold text-text-primary col-span-4 flex items-center">{row.specialisation}</div>
                      <div className="p-5 text-center font-bold text-accent col-span-3 flex items-center justify-center">{row.premium}</div>
                      <div className="p-5 text-text-muted col-span-5 flex items-center">{row.marketContext}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Tier A: Contractor Rates vs Perm Comparison ── */}
            {contractorRates && (
              <div className="mb-14">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-accent" />
                  <h3 className="font-heading text-xl font-bold text-text-primary">
                    Contractor Day Rates vs Permanent Salary Comparison
                  </h3>
                </div>
                <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-xs overflow-x-auto">
                  <div className="min-w-200">
                    <div className="grid grid-cols-5 bg-primary text-white font-heading font-semibold text-sm">
                      <div className="p-5">Role</div>
                      <div className="p-5 text-center">Day Rate (Outside IR35)</div>
                      <div className="p-5 text-center">Annual Equiv (Outside)</div>
                      <div className="p-5 text-center">Annual Equiv (Inside)</div>
                      <div className="p-5 text-center">Comparable Permanent Salary</div>
                    </div>
                    {contractorRates.map((row, idx) => (
                      <div key={idx} className={`grid grid-cols-5 border-b border-border text-sm font-body ${idx % 2 === 1 ? 'bg-surface/50' : ''}`}>
                        <div className="p-5 font-semibold text-text-primary flex items-center">{row.role}</div>
                        <div className="p-5 text-center font-semibold text-accent flex items-center justify-center">{row.dayRate}</div>
                        <div className="p-5 text-center text-text-body flex items-center justify-center">{row.annualOutside}</div>
                        <div className="p-5 text-center text-text-muted flex items-center justify-center">{row.annualInside}</div>
                        <div className="p-5 text-center text-text-body flex items-center justify-center">{row.permSalary}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* IR35 Note */}
            <div className="mt-8 p-6 bg-white border border-border rounded-xl shadow-xs">
              <h4 className="font-heading text-base font-bold text-text-primary mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-accent" />
                IR35 Tax Position
              </h4>
              <p className="text-text-body text-sm leading-relaxed font-body">
                Day rates assume outside IR35. Inside IR35 contractor day rates in the UK are typically 15–25% higher to compensate for the lack of tax efficiency and additional payroll costs. ClickMasters engineers are directly employed by us, representing **zero IR35 risk** for clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQs ── */}
      {faqs.length > 0 && (
        <section className="py-20 px-6 bg-background">
          <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
            <div className="max-w-7xl mx-auto">
              <span className="section-label mb-4">FAQs</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-text-muted mb-10 font-body">
                Everything you need to know about {role.replace(/-/g, ' ')} salary standards.
              </p>

              <div className="space-y-3">
                {faqs.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div
                      key={index}
                      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen
                        ? 'border-accent/30 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]'
                        : 'border-border bg-white hover:border-accent/20'
                        }`}
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
                      >
                        <span className={`font-heading font-semibold pr-4 transition-colors duration-200 ${isOpen ? 'text-accent' : 'text-text-primary'}`}>
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-accent' : 'text-text-muted'}`}
                        />
                      </button>
                      <div
                        className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}
                      >
                        <div className="px-6 pb-6">
                          <div className="pl-4 border-l-2 border-accent/30">
                            <p className="text-text-body text-sm leading-relaxed font-body">
                              {faq.answer}
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

      {/* ── Related Guides ── */}
      {relatedGuides.length > 0 && (
        <section className="py-20 px-6 bg-surface">
          <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
            <div className="max-w-7xl mx-auto">
              <span className="section-label mb-4">Resource Library</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Other Technology Salary Guides
              </h2>
              <p className="text-text-muted mb-8 font-body">
                Keep up-to-date with permanent compensation benchmarks and contractor day rates in the UK.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedGuides.map((rg) => (
                  <Link
                    key={rg.slug}
                    href={`/salary-guide/${rg.slug}`}
                    className="group flex flex-col justify-between p-5 bg-white rounded-xl border border-border hover:border-accent/30 transition-all duration-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-3">
                        <span className="text-[10px] font-bold text-accent uppercase tracking-wider bg-accent/5 px-2 py-0.5 rounded">
                          {rg.year}
                        </span>
                      </div>
                      <h4 className="font-heading text-base font-bold text-text-primary group-hover:text-accent transition-colors line-clamp-2 mb-2">
                        {rg.title.replace(/— Permanent.*/, '')}
                      </h4>
                      <p className="text-xs text-text-muted line-clamp-2 font-body">
                        {rg.metaDesc}
                      </p>
                    </div>
                    <div className="flex items-center text-xs font-semibold text-accent gap-1 mt-4 group-hover:gap-1.5 transition-all">
                      Read Guide <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary via-primary-mid to-primary-light px-8 py-14 md:px-14 md:py-18 text-center">
            <div className="absolute top-0 right-0 w-63 h-63 rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-50 h-50 rounded-full bg-accent/5 blur-3xl" />

            <div className="relative">
              <span className="section-label mb-6 bg-white/10 border-white/15 text-white/80">
                <Sparkles className="w-3 h-3 mr-1.5 inline -mt-0.5" />
                Build Your Revenue Team
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
                Scale Your Engineering Team Without IR35 Surcharges
              </h2>
              <p className="text-white/70 max-w-xl mx-auto mb-10 text-lg font-body">
                We deliver senior software engineers, data scientists, and cloud architects within 2 weeks on simple, rolling contracts.
              </p>
              <Link
                href="/contact"
                className="btn-primary inline-flex items-center justify-center gap-2 text-base px-10 py-4"
              >
                Get a Custom Rate Quote
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
