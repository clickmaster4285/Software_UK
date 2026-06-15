import Link from 'next/link';
import { hirePages } from '@/data/hire-pages';

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
  title: 'Hire Developers | ClickMasters',
  description: 'Hire vetted software developers in the UK. IR35-compliant, 3-stage vetting, 30-day rolling contracts.',
};

export default function HirePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Hire{' '}
            <span className="text-accent">Vetted Developers</span>
            {' '}in the UK
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            IR35-compliant. 3-stage technical vetting. 30-day rolling contracts.
            Your team, your way.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/contact"
              className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors"
            >
              Start Hiring
            </Link>
            <Link
              href="/about"
              className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-secondary/50 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Roles Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Available Roles</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((roleData) => (
              <div
                key={roleData.role}
                className="p-6 border border-border rounded-xl bg-card hover:border-accent/50 transition-colors"
              >
                <h3 className="text-xl font-semibold mb-2">
                  {roleData.roleDisplay} Developer
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Available in {roleData.cities.length} city{roleData.cities.length !== 1 ? 's' : ''}
                </p>

                <div className="flex flex-wrap gap-2">
                  {roleData.cities.slice(0, 6).map((cityData) => (
                    <Link
                      key={cityData.slug}
                      href={`/hire/${roleData.role}/${cityData.city}`}
                      className="px-3 py-1 text-sm bg-secondary rounded-full hover:bg-accent/20 hover:text-accent transition-colors"
                    >
                      {cityData.cityDisplay}
                    </Link>
                  ))}
                  {roleData.cities.length > 6 && (
                    <span className="px-3 py-1 text-sm text-muted-foreground">
                      +{roleData.cities.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Why Hire Through ClickMasters?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-card rounded-xl border border-border">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="text-lg font-semibold mb-2">Zero IR35 Risk</h3>
              <p className="text-muted-foreground text-sm">
                Our engineers are employees — not contractors. You engage us as a company,
                eliminating all IR35 liability.
              </p>
            </div>

            <div className="p-6 bg-card rounded-xl border border-border">
              <div className="text-3xl mb-3">✅</div>
              <h3 className="text-lg font-semibold mb-2">3-Stage Vetting</h3>
              <p className="text-muted-foreground text-sm">
                Technical assessment, reference checks, and culture fit —
                every developer is thoroughly vetted.
              </p>
            </div>

            <div className="p-6 bg-card rounded-xl border border-border">
              <div className="text-3xl mb-3">🔄</div>
              <h3 className="text-lg font-semibold mb-2">Flexible Contracts</h3>
              <p className="text-muted-foreground text-sm">
                30-day rolling contracts with no minimum commitment.
                Scale your team up or down monthly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Build Your Team?</h2>
          <p className="text-muted-foreground mb-8">
            Get a free consultation. Tell us what you need, we'll give you timeline and pricing.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors"
          >
            Book Free Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}