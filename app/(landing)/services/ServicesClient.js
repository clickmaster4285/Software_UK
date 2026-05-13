'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle,
  Users,
  Clock,
  Award,
  BarChart3,
  Rocket,
  Sparkles,
  Target,
  PenTool,
  GitBranch,
  TestTube,
  Wrench,
  Code2,
  Globe,
  Smartphone,
  Palette,
  Bot,
  Brain,
  MessageSquare,
  Settings2,
  Cloud,
  Database,
  Shield,
  FlaskConical,
  Blocks,
  Cpu,
  Glasses,
  MessageCircle,
  TrendingUp,
} from 'lucide-react';

const categoryIcons = {
  'Software Development': Code2,
  'Web Development': Globe,
  'Mobile Development': Smartphone,
  'Design': Palette,
  'Artificial Intelligence (AI)': Bot,
  'Machine Learning (ML)': Brain,
  'NLP & Computer Vision': MessageSquare,
  'Data Services': BarChart3,
  'Automation & Integration': Settings2,
  'Cloud & DevOps': Cloud,
  'Database Services': Database,
  'Cybersecurity': Shield,
  'Testing & QA': FlaskConical,
  'Support & Outsourcing': Users,
  'Blockchain & Web3': Blocks,
  'IoT & Emerging Tech': Cpu,
  'Immersive Tech': Glasses,
  'Automation & Chatbot': MessageCircle,
  'Data & Intelligence': TrendingUp,
};

const processSteps = [
  {
    icon: Target,
    title: 'Discovery & Strategy',
    description: 'Deep discovery and strategy to understand your business and technical requirements.',
  },
  {
    icon: PenTool,
    title: 'Design & Prototyping',
    description: 'Modern UI/UX designs and interactive prototypes for your application.',
  },
  {
    icon: GitBranch,
    title: 'Agile Development',
    description: 'Iterative delivery with continuous integration and weekly progress updates.',
  },
  {
    icon: TestTube,
    title: 'Testing & QA',
    description: 'Rigorous testing and quality assurance for secure, bug-free solutions.',
  },
  {
    icon: Wrench,
    title: 'Deployment & Support',
    description: 'Cloud deployment, DevOps maintenance, and ongoing feature enhancements.',
  },
];

const stats = [
  { value: '150', label: 'Successful Projects Delivered', icon: Award },
  { value: '50', label: 'Satisfied Clients Worldwide', icon: Users },
  { value: '98', label: 'Client Retention Rate', icon: BarChart3 },
  { value: '24/7', label: 'Support Hours Available', icon: Clock },
];

const technologies = [
  { name: 'React' },
  { name: 'Next.js' },
  { name: 'Vue.js' },
  { name: 'Angular' },
  { name: 'Node.js' },
  { name: 'Python' },
  { name: 'Java' },
  { name: 'PHP' },
  { name: 'AWS Cloud' },
  { name: 'Azure Cloud' },
  { name: 'Docker' },
  { name: 'Kubernetes' },
  { name: 'MongoDB' },
  { name: 'PostgreSQL' },
  { name: 'MySQL' },
  { name: 'Redis' },
];

export default function ServicesClient({ services, categories }) {
  return (
    <section className="relative py-24 overflow-hidden bg-white">
      <div className="container relative z-10 mx-auto max-w-7xl px-4">
        {/* Header Section */}
        <div className="mt-20 text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-primary mb-4 font-heading">
            Software That <span className="text-accent">Accelerates</span> Your Business
          </h1>
          <p className="text-text-body max-w-2xl mx-auto text-base md:text-lg mt-4 font-body">
            From concept to deployment, we deliver custom software solutions that automate processes, engage users, and give you a competitive edge.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center p-6 rounded-2xl bg-white border border-border">
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-full bg-accent/10">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2 font-heading">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-text-muted">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Services by Category - All Expanded */}
        <div className="space-y-12 mb-20">
          {categories.map((category, catIndex) => {
            const categoryServices = services.filter((s) => s.category === category.label);
            const IconComponent = categoryIcons[category.label] || Code2;
            const categorySlugFormatted = category.label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

            return (
              <div key={catIndex} className="border border-border rounded-2xl overflow-hidden">
                {/* Category Header */}
                <div className="flex items-center gap-4 p-6 bg-surface border-b border-border">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <IconComponent className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-primary font-heading">{category.label}</h2>
                  <span className="text-sm text-text-muted bg-white px-3 py-1 rounded-full border border-border">
                    {categoryServices.length} services
                  </span>
                </div>

                {/* Services Grid - Always Visible */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-white">
                  {categoryServices.map((service, index) => {
                    const serviceSlug = service.slug;
                    const href = `/${categorySlugFormatted}/${serviceSlug}`;

                    return (
                      <Link key={index} href={href} className="group block">
                        <div className="bg-white rounded-xl p-6 border border-border h-full transition-all duration-300 hover:shadow-lg hover:border-accent/30">
                          <h3 className="text-lg md:text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors font-heading">
                            {service.title}
                          </h3>

                          <p className="text-text-body text-sm leading-relaxed mb-4 line-clamp-2 font-body">
                            {service.lead}
                          </p>

                          <div className="space-y-2 mb-4">
                            {service.highlights?.slice(0, 2).map((feature, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                                <span className="text-xs text-text-body">{feature}</span>
                              </div>
                            ))}
                          </div>

                          <span className="inline-flex items-center text-sm font-semibold text-accent">
                            Learn more
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Process Section - Static */}
        <div className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 tracking-tight font-heading">
              Our <span className="text-accent">Process</span>
            </h2>
            <p className="text-text-body text-base md:text-lg max-w-2xl mx-auto font-body">
              A transparent, collaborative approach that ensures your vision becomes a successful digital product.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 border border-border text-center hover:border-accent/30 transition-colors">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-sm font-semibold text-primary mb-2 font-heading">{step.title}</h3>
                  <p className="text-xs text-text-muted leading-relaxed font-body">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technologies Section */}
        <div className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-4 font-heading">
              Technologies We <span className="text-accent">Use</span>
            </h2>
            <p className="text-sm md:text-base text-text-muted font-body">
              Modern, cutting-edge technologies for robust and scalable solutions.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {technologies.map((tech, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-surface-2 text-text-body rounded-full text-sm hover:bg-accent/10 hover:text-accent transition-colors cursor-default"
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div>
          <div className="bg-linear-to-br from--primary to--primary-light rounded-2xl md:rounded-3xl p-8 md:p-12 overflow-hidden">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 font-heading">
                Ready to Build Your
                <span className="font-bold block mt-2 text-accent">Custom Software Solution?</span>
              </h3>
              <p className="text-sm md:text-base lg:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto mb-8 font-body">
                Let&apos;s discuss your project requirements and see how we can help you achieve your business goals.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact-us">
                  <button className="px-6 py-3 md:px-8 md:py-4 bg-accent text-white text-sm font-medium tracking-wider rounded-md hover:bg-accent-hover transition-colors">
                    <span className="flex items-center justify-center">
                      Contact us
                      <Rocket className="ml-2 h-4 w-4" />
                    </span>
                  </button>
                </Link>

                <Link href="/case-studies">
                  <button className="px-6 py-3 md:px-8 md:py-4 bg-transparent text-white text-sm font-medium tracking-wider border border-white/30 hover:border-white/60 transition-colors rounded-md">
                    <span className="flex items-center justify-center">
                      View case studies
                      <Sparkles className="ml-2 h-4 w-4" />
                    </span>
                  </button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-8 text-sm text-white/60">
                <span className="flex items-center"><span className="w-1.5 h-1.5 bg-accent rounded-full mr-2" />Free Consultation</span>
                <span className="flex items-center"><span className="w-1.5 h-1.5 bg-accent rounded-full mr-2" />No Commitment</span>
                <span className="flex items-center"><span className="w-1.5 h-1.5 bg-accent rounded-full mr-2" />24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}