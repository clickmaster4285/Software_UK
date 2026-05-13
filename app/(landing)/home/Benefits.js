const benefits = [
  {
    stat: "1,860+",
    label: "Projects Delivered",
    services: ["Custom Software Development", "Tailored software built for your business. Web apps, desktop applications, and backend systems that scale."],
  },
  {
    stat: "3,500+",
    label: "Happy Clients",
    services: ["Web Application Development", "Modern web apps with React, Node, and cloud hosting. Responsive, fast, and secure applications."],
  },
  {
    stat: "75+",
    label: "Industry Awards",
    services: ["Mobile App Development", "Native and cross-platform mobile apps for iOS and Android. From MVP to enterprise solutions."],
  },
  {
    stat: "5+",
    label: "Years",
    services: ["ERP & Business Software", "ERP, CRM, inventory, and workflow automation. Integrate with your existing systems and processes."],
  },
  {
    stat: "API",
    label: "& Integrations",
    services: ["API & Integrations", "REST APIs, third-party integrations, and legacy system modernization. Connect your software ecosystem."],
  },
  {
    stat: "24/7",
    label: "Support",
    services: ["Maintenance & Support", "Ongoing updates, security patches, and technical support. Keep your software running smoothly."],
  },
];

export default function Benefits() {
  return (
    <section className="py-20 bg-surface">
      <div className="max-w-400 mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-4">
            Why Choose Our Software Development Services
          </h2>
          <p className="text-text-body font-body max-w-2xl mx-auto">
            We deliver custom software, web apps, and mobile apps with experienced developers, agile process, and on-time delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white p-6 rounded-xl">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-heading font-bold text-4xl text-accent">
                  {benefit.stat}
                </span>
                <span className="text-text-body font-body font-medium">
                  {benefit.label}
                </span>
              </div>
              <div className="border-t border-border pt-4 mt-4">
                <h3 className="font-heading font-semibold text-primary mb-2">
                  {benefit.services[0]}
                </h3>
                <p className="text-text-muted font-body text-sm">
                  {benefit.services[1]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

