export const metadata = {
  title: 'Pricing - Clickmasters',
  description: 'Flexible pricing plans for your business needs',
};

const plans = [
  {
    name: 'Starter',
    price: 19,
    badge: null,
    features: ['Core features', 'Basic Integrations', 'Standard security', 'Email support']
  },
  {
    name: 'Pro',
    price: 49,
    badge: 'Popular',
    features: ['Core features', 'Advanced Integrations', 'Enhanced security', 'Priority support', 'Analytics dashboard', 'API access']
  },
  {
    name: 'Enterprise',
    price: 129,
    badge: null,
    features: ['Everything in Pro', 'Custom integrations', 'Dedicated security', '24/7 support', 'Custom reporting', 'SLA guarantee', 'Dedicated account manager']
  }
];

export default function PricingPage() {
  return (
    <>
    <main>
        <section className="pricing-hero">
          <div className="container">
            <span className="section-label">PRICING</span>
            <h1>Flexible Plans, Real Value</h1>
            <p className="hero-sub">Choose the plan that fits your business needs.</p>
          </div>
        </section>

        <section className="pricing-cards">
          <div className="container">
            <div className="cards-grid">
              {plans.map((plan, index) => (
                <div key={plan.name} className={`pricing-card ${plan.badge ? 'popular' : ''}`} style={{ animationDelay: `${index * 0.1}s` }}>
                  {plan.badge && <span className="badge">{plan.badge}</span>}
                  <h3>{plan.name}</h3>
                  <div className="price">
                    <span className="amount">${plan.price}</span>
                    <span className="period">/mo</span>
                  </div>
                  <ul className="features">
                    {plan.features.map(feature => (
                      <li key={feature}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="btn-primary">Get Started</button>
                  <div className="payment-icons">
                    <span>Visa</span>
                    <span>PayPal</span>
                    <span>Mastercard</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <div className="cta-text">
                <h3>Add Insight Engine</h3>
                <p>Human Logic Meets Intelligent Software</p>
              </div>
              <div className="experts">
                <div className="expert-avatars">
                  <div className="avatar"></div>
                  <div className="avatar"></div>
                </div>
                <span>59+ Available Tech Experts</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

