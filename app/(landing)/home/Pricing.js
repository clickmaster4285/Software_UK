import Link from "next/link";

const plans = [
   {
      name: "Starter",
      price: "$10k+",
      description: "For MVP and small projects",
      features: ["Single platform (web or mobile)", "Up to 10 screens", "Basic backend API", "1 month support"],
      popular: false,
   },
   {
      name: "Professional",
      price: "$25k+",
      description: "For growing businesses",
      features: ["Web + Mobile (cross-platform)", "Up to 25 screens", "Full backend with auth", "Database integration", "3 months support"],
      popular: true,
   },
   {
      name: "Enterprise",
      price: "$50k+",
      description: "For large-scale solutions",
      features: ["Full-stack web + mobile", "Unlimited screens", "Advanced integrations", "Cloud infrastructure", "Custom workflows", "12 months support"],
      popular: false,
   },
];

export default function Pricing() {
   return (
      <section className="py-20 bg-white">
         <div className="max-w-400 mx-auto px-6">
            <div className="text-center mb-12">
               <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-4">
                  Pricing
               </h2>
               <p className="text-text-body font-body">
                  Transparent pricing for projects of all sizes
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {plans.map((plan, index) => (
                  <div
                     key={index}
                     className={`p-6 rounded-xl border ${plan.popular
                        ? "border-accent bg-surface"
                        : "border-border"
                        }`}
                  >
                     {plan.popular && (
                        <span className="inline-block px-3 py-1 bg-accent text-white text-xs font-body rounded-full mb-4">
                           Most Popular
                        </span>
                     )}
                     <h3 className="font-heading font-bold text-xl text-primary mb-2">
                        {plan.name}
                     </h3>
                     <div className="mb-2">
                        <span className="font-heading font-bold text-3xl text-primary">
                           {plan.price}
                        </span>
                     </div>
                     <p className="text-text-muted font-body text-sm mb-6">
                        {plan.description}
                     </p>
                     <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, i) => (
                           <li key={i} className="flex items-center gap-2 text-text-body font-body text-sm">
                              <svg className="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              {feature}
                           </li>
                        ))}
                     </ul>
                     <Link
                        href="/contact"
                        className={`block w-full px-6 py-3 text-center font-body font-medium rounded-lg transition-colors ${plan.popular
                           ? "bg-accent text-white hover:bg-accent-hover"
                           : "border-2 border-primary text-primary hover:bg-primary hover:text-white"
                           }`}
                     >
                        Get Started
                     </Link>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
}
