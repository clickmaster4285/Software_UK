'use client';

import Link from 'next/link';

export function HireDetailClient({ hirePage, relatedPages }) {
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
    readingTime
  } = hirePage;

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-secondary/30 py-3 px-6">
        <div className="max-w-7xl mx-auto text-sm text-muted-foreground">
          <Link href="/" className="hover:text-accent">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/hire" className="hover:text-accent">Hire Developers</Link>
          <span className="mx-2">›</span>
          <span className="text-foreground">{cityDisplay}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {title}
          </h1>

          {/* Badges */}
          <div className="flex flex-wrap gap-3 mb-6">
            {cityDisplay && (
              <span className="px-4 py-2 bg-card border border-border rounded-full text-sm">
                🏙️ {cityDisplay}
              </span>
            )}
            {rate && (
              <span className="px-4 py-2 bg-card border border-border rounded-full text-sm">
                💷 {rate}
              </span>
            )}
            <span className="px-4 py-2 bg-card border border-border rounded-full text-sm">
              ⚖️ Zero IR35 Risk
            </span>
            <span className="px-4 py-2 bg-card border border-border rounded-full text-sm">
              ✅ 3-Stage Vetting
            </span>
          </div>

          {lastUpdated && (
            <p className="text-sm text-muted-foreground">
              Last updated: {lastUpdated} • {readingTime || 8} min read
            </p>
          )}
        </div>
      </section>

      {/* Direct Answer */}
      {directAnswer && (
        <section className="py-12 px-6 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <div className="p-6 bg-card border border-accent/30 rounded-xl">
              <h2 className="text-lg font-semibold mb-3">Quick Answer</h2>
              <p className="text-muted-foreground">{directAnswer}</p>
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      {benefits.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">
              Why {cityDisplay} Businesses Choose ClickMasters
            </h2>

            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex gap-3 p-4 bg-card rounded-lg border border-border">
                  <span className="text-accent text-xl">✓</span>
                  <span className="text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Rates Table */}
      {rates && (rates.mid || rates.senior || rates.lead) && (
        <section className="py-12 px-6 bg-secondary/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">
              {cityDisplay} Developer Rates — 2025 Pricing
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full bg-card border border-border rounded-xl">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-semibold">Engagement Type</th>
                    <th className="text-left p-4 font-semibold">Mid-Level</th>
                    <th className="text-left p-4 font-semibold">Senior</th>
                    <th className="text-left p-4 font-semibold">Technical Lead</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="p-4">Monthly Rate</td>
                    <td className="p-4 font-semibold text-accent">{rates.mid || 'POA'}</td>
                    <td className="p-4 font-semibold text-accent">{rates.senior || 'POA'}</td>
                    <td className="p-4 font-semibold text-accent">{rates.lead || 'POA'}</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4">IR35 Position</td>
                    <td className="p-4">N/A — Employees</td>
                    <td className="p-4">N/A — Employees</td>
                    <td className="p-4">N/A — Employees</td>
                  </tr>
                  <tr>
                    <td className="p-4">Replacement Guarantee</td>
                    <td className="p-4">2 weeks</td>
                    <td className="p-4">2 weeks</td>
                    <td className="p-4">2 weeks</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">
              Technical Skills
            </h2>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-secondary rounded-lg text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Vetting Process */}
      {vettingProcess.length > 0 && (
        <section className="py-12 px-6 bg-secondary/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">
              Our 3-Stage Vetting Process
            </h2>

            <div className="space-y-4">
              {vettingProcess.map((stage, index) => (
                <div
                  key={index}
                  className="p-6 bg-card border border-border rounded-xl"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex items-center justify-center w-10 h-10 bg-accent text-white rounded-full font-bold">
                      {stage.stage || index + 1}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{stage.title}</h3>
                      <p className="text-muted-foreground">{stage.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      {faqs.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="p-6 bg-card border border-border rounded-xl"
                >
                  <h3 className="font-semibold mb-2">
                    Q: {faq.question.replace(/^:\s*/, '')}
                  </h3>
                  <p className="text-muted-foreground">
                    A: {faq.answer.replace(/^:\s*/, '')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Cities */}
      {relatedPages.length > 0 && (
        <section className="py-12 px-6 bg-secondary/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">
              Other Cities
            </h2>

            <div className="flex flex-wrap gap-3">
              {relatedPages.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/hire/${rp.role}/${rp.city}`}
                  className="px-4 py-2 bg-card border border-border rounded-lg hover:border-accent/50 transition-colors"
                >
                  {rp.cityDisplay}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">
            Hire a Developer in {cityDisplay}
          </h2>
          <p className="text-muted-foreground mb-8">
            30-minute team-planning call. Tell us the role, we give you timeline, rates, and IR35 clarity.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors"
          >
            Start Hiring
          </Link>
        </div>
      </section>
    </div>
  );
}