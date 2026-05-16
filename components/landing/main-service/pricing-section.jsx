import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Starter",
    description: "Perfect for small teams getting started",
    price: "Free",
    period: "forever",
    features: [
      "Up to 3 users",
      "2 apps included",
      "5GB storage",
      "Community support",
      "Basic integrations",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Professional",
    description: "For growing businesses that need more",
    price: "$24",
    period: "/user/month",
    features: [
      "Unlimited users",
      "All 30+ apps",
      "100GB storage",
      "Priority support",
      "Advanced integrations",
      "Custom reports",
      "API access",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For large organizations with custom needs",
    price: "Custom",
    period: "pricing",
    features: [
      "Everything in Pro",
      "Unlimited storage",
      "Dedicated support",
      "Custom development",
      "On-premise option",
      "SLA guarantee",
      "Security audit",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export function PricingSection({ plans: customPlans, title }) {
  const displayPlans = customPlans && customPlans.length > 0 ? customPlans : plans;

  return (
    <section id="pricing" className="py-24 bg-white font-sans">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-8 h-0.5 bg-primary rounded-full" />
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-slate-500">
              Pricing & Plans
            </p>
            <span className="w-8 h-0.5 bg-primary rounded-full" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 mb-4 text-balance">
            {title || "Simple, transparent pricing"}
          </h2>
          <p className="text-lg text-slate-600 font-body text-pretty">
            Start free and scale grow. No hidden fees, no surprises. 
            All plans include updates and new features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {displayPlans.map((plan, index) => (
            <Card 
              key={plan.name} 
              className={`relative bg-white border border-slate-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${plan.popular ? "border-primary shadow-lg ring-1 ring-primary/20" : ""}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white border-none px-4 py-1">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center pb-4 pt-8">
                <CardTitle className="text-xl font-heading font-bold text-slate-900">{plan.name}</CardTitle>
                <CardDescription className="text-slate-500 font-body mt-2">{plan.description}</CardDescription>
                <div className="pt-6">
                  <span className="text-4xl font-heading font-bold text-slate-900">{plan.price}</span>
                  <span className="text-slate-400 ml-1 font-body text-sm">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-primary" strokeWidth={3} />
                      </div>
                      <span className="text-sm text-slate-600 font-body leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full h-12 rounded-xl text-sm font-semibold transition-all duration-300 ${plan.popular ? "bg-primary text-white hover:bg-primary/90" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta || "Get Started"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-center text-sm text-slate-400 mt-12 font-body">
          * All projects include a detailed strategy call and technical audit.
        </p>
      </div>
    </section>
  )
}
