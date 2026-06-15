import Link from 'next/link';
import { hirePages } from '@/data/hire-pages';
import { ArrowRight, Shield, CheckCircle, Clock, Users, MapPin, Sparkles, ChevronRight } from 'lucide-react';

// Group hire pages by role
const rolesMap = new Map();

hirePages.forEach(hp => {
  if (!rolesMap.has(hp.role)) {
    rolesMap.set(hp.role, {
      role: hp.role,
      roleDisplay: hp.role.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      cities: []
    });
  }
  rolesMap.get(hp.role).cities.push({
    city: hp.city,
    cityDisplay: hp.cityDisplay || hp.city,
    slug: hp.slug,
    rate: hp.rate
  });
});

const roles = Array.from(rolesMap.values());

export const metadata = {
  title: 'Hire Developers | ClickMasters — Vetted UK Engineers',
  description: 'Hire vetted software developers across the UK. IR35-compliant, 3-stage vetting, 30-day rolling contracts. React, Python, .NET, mobile & more.',
};

const stats = [
  { number: '258+', label: 'City-Role Combinations' },
  { number: '3-Stage', label: 'Technical Vetting' },
  { number: '0', label: 'IR35 Liability' },
];

const trustCards = [
  {
    icon: Shield,
    title: 'Zero IR35 Risk',
    description: 'Our engineers are ClickMasters employees — not contractors. You engage us as a company. No Status Determination Statement. No HMRC exposure.',
    highlight: true,
  },
  {
    icon: CheckCircle,
    title: '3-Stage Vetting',
    description: 'Technical assessment, reference checks, and culture fit — every developer passes all three stages before placement.',
    highlight: false,
  },
  {
    icon: Clock,
    title: '30-Day Rolling',
    description: 'No 6-month lock-ins. Scale your team up or down monthly with 30-day rolling contracts and no minimum commitment.',
    highlight: false,
  },
  {
    icon: Users,
    title: '2-Week Replacement',
    description: 'Not the right fit within 30 days? We replace your developer at no extra charge. Your project stays on track.',
    highlight: false,
  },
];

export default function HirePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        {/* Background linear */}
        <div className="absolute inset-0 bg-linear-to-br from-primary via-primary-mid to-primary-light" />
        {/* Decorative blobs */}
        <div className="absolute top-20 right-[10%] w-[500px] h-[500px] rounded-full bg-accent/8 blur-3xl" />
        <div className="absolute bottom-0 left-[5%] w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl" />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-linear(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative max-w-[96vw] lg:max-w-[90vw] mx-auto px-6">
          <div className="max-w-7xl mx-auto text-center">
            {/* Section label */}
            <span className="section-label mb-6 bg-white/10 border-white/15 text-white/80">
              <Sparkles className="w-3 h-3 mr-1.5 inline -mt-0.5" />
              Hire Developers
            </span>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Hire{' '}
              <span className="bg-linear-to-r from-accent to-accent-light bg-clip-text text-transparent">
                Vetted Developers
              </span>
              <br className="hidden md:block" />
              {' '}Across the UK
            </h1>

            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
              IR35-compliant. 3-stage technical vetting. 30-day rolling contracts.
              Your team, your way.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="btn-primary inline-flex items-center justify-center gap-2 text-base px-8 py-4"
              >
                Start Hiring
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#roles"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white rounded-lg font-medium hover:bg-white/10 transition-colors text-base"
              >
                View Roles
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center px-6 py-5 rounded-xl bg-white/[0.07] border border-white/[0.1] backdrop-blur-sm"
              >
                <p className="font-heading text-2xl md:text-3xl font-bold text-white">
                  {stat.number}
                </p>
                <p className="mt-1 text-sm text-white/60 font-body">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Cards ── */}
      <section className="py-20 px-6 bg-surface">
        <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
          <div className="text-center mb-12">
            <span className="section-label mb-4">Why ClickMasters</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Enterprise-Grade Hiring,
              <br className="hidden md:block" />
              {' '}Without the Enterprise Overhead
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Every developer we place has passed our rigorous vetting process.
              You get senior talent without the compliance headaches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className={`relative p-7 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] ${
                    card.highlight
                      ? 'bg-primary text-white border-primary shadow-[0_4px_24px_rgba(0,0,0,0.15)]'
                      : 'bg-white border-border hover:border-accent/30'
                  }`}
                >
                  <div className={`icon-circle mb-5 ${card.highlight ? 'bg-white/15' : ''}`}>
                    <Icon className={`w-5 h-5 ${card.highlight ? 'text-white' : ''}`} />
                  </div>
                  <h3 className={`font-heading text-lg font-semibold mb-3 ${card.highlight ? 'text-white' : 'text-text-primary'}`}>
                    {card.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${card.highlight ? 'text-white/80' : 'text-text-body'}`}>
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Roles Grid ── */}
      <section id="roles" className="py-20 px-6">
        <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
          <div className="text-center mb-12">
            <span className="section-label mb-4">Available Roles</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Browse by Technology
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Click any city to see detailed rates, vetting process, and FAQs for that role.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((roleData) => (
              <div
                key={roleData.role}
                className="group p-7 rounded-2xl border border-border bg-white transition-all duration-300 hover:border-accent/30 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-text-primary group-hover:text-accent transition-colors duration-300">
                      {roleData.roleDisplay} Developer
                    </h3>
                    <p className="text-sm text-text-muted mt-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {roleData.cities.length} location{roleData.cities.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <span className="icon-circle shrink-0 w-10 h-10">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  {roleData.cities.slice(0, 5).map((cityData) => (
                    <Link
                      key={cityData.slug}
                      href={`/hire/${roleData.role}/${cityData.city}`}
                      className="px-3 py-1.5 text-sm bg-surface rounded-full hover:bg-accent/10 hover:text-accent transition-colors border border-transparent hover:border-accent/20"
                    >
                      {cityData.cityDisplay.charAt(0).toUpperCase() + cityData.cityDisplay.slice(1)}
                    </Link>
                  ))}
                  {roleData.cities.length > 5 && (
                    <span className="px-3 py-1.5 text-sm text-text-muted">
                      +{roleData.cities.length - 5} more
                    </span>
                  )}
                </div>

                <Link
                  href={`/hire/${roleData.role}/${roleData.cities[0].city}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
                >
                  View rates & details
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process Steps ── */}
      <section className="py-20 px-6 bg-surface">
        <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
          <div className="text-center mb-14">
            <span className="section-label mb-4">How It Works</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-primary mb-4">
              From Call to Developer in 4 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { step: '01', title: 'Discovery Call', desc: '30-minute call to understand your requirements, tech stack, and timeline.' },
              { step: '02', title: 'Matching', desc: 'We match you with pre-vetted developers who fit your technical and culture needs.' },
              { step: '03', title: 'Interview', desc: 'Meet your shortlisted developers. Technical deep-dive or informal chat — your choice.' },
              { step: '04', title: 'Onboarding', desc: 'Developer starts within 1–2 weeks. 30-day rolling contract, scale anytime.' },
            ].map((item, i) => (
              <div key={item.step} className="relative text-center md:text-left">
                {/* Connector line */}
                {i < 3 && (
                  <div className="hidden md:block absolute top-6 left-[calc(50%+30px)] w-[calc(100%-60px)] h-px bg-border" />
                )}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent font-heading font-bold text-lg mb-4">
                  {item.step}
                </div>
                <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-text-body leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6">
        <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary via-primary-mid to-primary-light px-8 py-16 md:px-16 md:py-20 text-center">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[250px] h-[250px] rounded-full bg-accent/5 blur-3xl" />

            <div className="relative">
              <span className="section-label mb-6 bg-white/10 border-white/15 text-white/80">
                Ready to Hire?
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
                Build Your Team Today
              </h2>
              <p className="text-white/70 max-w-xl mx-auto mb-10 text-lg">
                Free consultation. Tell us what you need — we'll give you timeline,
                pricing, and IR35 clarity within 24 hours.
              </p>
              <Link
                href="/contact"
                className="btn-primary inline-flex items-center justify-center gap-2 text-base px-10 py-4"
              >
                Book Free Consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
