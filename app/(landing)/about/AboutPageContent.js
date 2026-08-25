'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Target, Users, Lightbulb, Zap, Rocket, MessageSquare, Cpu, Briefcase, Compass } from 'lucide-react';
import JsonLd from '@/components/JsonLd';
import { aboutPageSchema } from '@/app/metadata-config';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';

// Lazy-load heavy below-the-fold sections (named exports)
const TechStackSection = dynamic(() =>
  import('@/components/landing/main-service/TechStackSection').then(mod => {
    const C = mod.TechStackSection;
    const W = (p) => <C {...p} />;
    W.displayName = 'TechStackSection';
    return W;
  }), { ssr: true }
);
const TrustedClientsSection = dynamic(() =>
  import('@/components/landing/main-service/TrustedClientsSection').then(mod => {
    const C = mod.TrustedClientsSection;
    const W = (p) => <C {...p} />;
    W.displayName = 'TrustedClientsSection';
    return W;
  }), { ssr: true }
);
const FinalCTA = dynamic(() =>
  import('@/components/landing/main-service/finalCta').then(mod => {
    const C = mod.FinalCTA;
    const W = (p) => <C {...p} />;
    W.displayName = 'FinalCTA';
    return W;
  }), { ssr: true }
);

export default function AboutPageContent() {
  return (
    <main className="min-h-screen bg-background relative overflow-x-hidden">
      <JsonLd schema={aboutPageSchema()} />

      {/* ── Hero Section ── */}
      <section className="relative min-h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/aboutus.webp"
            alt="About Clickmasters"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/80 mix-blend-multiply" />
        </div>

        <div className="relative z-10 container mx-auto max-w-[96vw] lg:max-w-[90vw] px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl xl:text-7xl font-bold mb-6 tracking-tight font-heading text-white">
              About Clickmasters
            </h1>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Clickmasters brings software strategy, product thinking and engineering together to turn ideas into useful digital products. We work with businesses that need more than code. They need a development partner capable of understanding what they want to achieve, shaping the right technical direction and building software around real users and practical requirements.
            </p>
            <p className="text-lg text-white/80 mb-10">
              From new digital products to existing systems ready for their next stage, our focus is simple: build technology with a clear purpose.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact-us">
                <Button className="btn-primary px-8 py-6 text-lg rounded-xl">
                  Discuss Your Project
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── We Build Software With Purpose & Thinking ── */}
      <section className="py-24 relative overflow-hidden bg-background">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto max-w-[96vw] lg:max-w-[90vw] px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-medium text-sm mb-6 border border-accent/20 shadow-[0_0_15px_rgba(var(--accent-rgb),0.2)]">
                <Target className="w-4 h-4" /> Our Philosophy
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-8 leading-tight">
                We Build Software With <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-600">Purpose</span>
              </h2>
              <div className="space-y-6">
                <p className="text-muted-foreground leading-relaxed text-lg flex items-start gap-3">
                  <span className="w-2 h-2 mt-2 rounded-full bg-accent shrink-0" />
                  <span>Technology works best when it solves a real problem. That is why we do not begin a project by deciding which framework, platform or trend to use.</span>
                </p>
                <p className="text-muted-foreground leading-relaxed text-lg flex items-start gap-3">
                  <span className="w-2 h-2 mt-2 rounded-full bg-accent shrink-0" />
                  <span>We begin by understanding the business, the people who will use the software and the outcome the project needs to achieve.</span>
                </p>
                <div className="p-6 rounded-2xl bg-surface border border-border mt-8 border-l-4 border-l-accent shadow-sm">
                  <p className="text-foreground font-medium text-lg italic">
                    &ldquo;Once the goal is clear, we shape the software around it. Your requirement comes first. Technology follows.&rdquo;
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-accent to-purple-600 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white/60 backdrop-blur-2xl border border-white/40 p-10 lg:p-14 rounded-[2rem] shadow-xl transition-all duration-500">
                <h3 className="text-3xl font-bold font-heading mb-8 text-foreground">
                  The Thinking Behind <br /><span className="text-accent">Clickmasters</span>
                </h3>
                <div className="space-y-6 text-muted-foreground">
                  <p className="leading-relaxed">
                    Clickmasters was built around a straightforward idea: software development should connect technical expertise with business understanding.
                  </p>
                  <p className="leading-relaxed">
                    Building functionality is only part of a successful software project. The bigger challenge is deciding what should be built, why it matters and how the product should continue to develop as requirements change.
                  </p>
                  <p className="leading-relaxed font-medium text-foreground bg-accent/5 p-4 rounded-xl border border-accent/10">
                    We combine software engineering, product thinking, design and emerging technologies such as artificial intelligence to create solutions that are useful now and capable of evolving later.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-32 bg-primary relative overflow-hidden flex items-center justify-center">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-10 mix-blend-overlay" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/20 rounded-full blur-[150px]" />
          {/* Big background text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] font-bold font-heading text-white/[0.03] select-none pointer-events-none whitespace-nowrap">
            MISSION
          </div>
        </div>

        <div className="container mx-auto max-w-[85vw] md:max-w-[75vw]  px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="p-12 md:p-16 rounded-[3rem] bg-white/5 backdrop-blur-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)]"
          >
            <h2 className="text-4xl  md:text-5xl lg:text-6xl font-bold font-heading mb-8 text-white leading-tight">
              Build Better <br />
              <span className="text-accent">Digital Possibilities</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/90  leading-relaxed font-medium">
              Our mission is to help businesses use software as a practical driver of digital growth.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mb-8 opacity-50" />
            <p className="text-lg text-white/70 mb-6 leading-relaxed max-w-2xl mx-auto">
              We aim to make the journey from idea to working software clearer, more collaborative and more closely connected to the outcome the business wants to achieve.
            </p>
            <p className="text-lg text-white/70 leading-relaxed max-w-2xl mx-auto">
              Whether the project starts with a fully defined specification or simply a problem that needs solving, we help turn the requirement into a clear development direction.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── How We Think (Wave & Blobs Design with Bento Grid) ── */}
      <section className="py-32 relative overflow-hidden" style={{ background: 'oklch(0.99 0.005 250)' }}>
        {/* Animated wave background */}
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
          {/* Drifting blobs */}
          <div className="blob-drift absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-40"
            style={{ background: 'radial-gradient(circle, oklch(0.5675 0.2072 318.97 / 0.18) 0%, transparent 70%)' }} />
          <div className="blob-drift absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, oklch(0.5675 0.2072 318.97 / 0.14) 0%, transparent 70%)', animationDelay: '-6s' }} />

          {/* Wave 1 — slow */}
          <svg className="wave-slow absolute bottom-0 left-0 w-full opacity-70" style={{ height: '220px' }}
            viewBox="0 0 1440 220" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,120 C240,180 480,60 720,120 C960,180 1200,60 1440,120 L1440,220 L0,220 Z" fill="oklch(0.5675 0.2072 318.97 / 0.08)" />
          </svg>
          {/* Wave 2 — mid */}
          <svg className="wave-mid absolute bottom-0 left-0 w-full opacity-70" style={{ height: '180px' }}
            viewBox="0 0 1440 180" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,90 C360,150 720,30 1080,90 C1260,120 1380,60 1440,90 L1440,180 L0,180 Z" fill="oklch(0.5675 0.2072 318.97 / 0.06)" />
          </svg>
          {/* Wave 3 — fast */}
          <svg className="wave-fast absolute top-0 left-0 w-full opacity-70" style={{ height: '160px' }}
            viewBox="0 0 1440 160" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,60 C180,100 360,20 540,60 C720,100 900,20 1080,60 C1260,100 1380,30 1440,60 L1440,0 L0,0 Z" fill="oklch(0.28 0.02 250 / 0.05)" />
          </svg>
        </div>

        <div className="container mx-auto max-w-[96vw] lg:max-w-[90vw] px-6 relative z-10">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm text-accent font-semibold text-sm mb-6 border border-accent/20 shadow-sm">
                Methodology
              </span>
              <h2 className="text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight">
                How We Think About <br /><span className="text-accent ">Software Development</span>
              </h2>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
            {[
              {
                title: 'Business Before Technology',
                desc: 'The technical solution should support the objective, not distract from it. We first understand what success should look like and then determine how software can help achieve it.',
                icon: <Briefcase className="w-8 h-8 text-accent " />,
                span: 'lg:col-span-2',
                gradient: 'from-blue-500 to-accent'
              },
              {
                title: 'Build Around Real Users',
                desc: 'Good software should make something easier, faster, clearer or more valuable for the people using it. User needs remain part of the conversation throughout development.',
                icon: <Users className="w-8 h-8 text-accent " />,
                span: 'lg:col-span-1',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                title: 'Use Technology With Purpose',
                desc: 'Modern technologies such as AI, cloud platforms and automation can create significant opportunities, but only when they solve a genuine requirement.',
                icon: <Target className="w-8 h-8 text-accent " />,
                span: 'lg:col-span-1',
                gradient: 'from-orange-500 to-red-500'
              },
              {
                title: 'Keep Development Collaborative',
                desc: 'Better products come from combining business knowledge with technical expertise. We keep clients involved in important decisions throughout the project.',
                icon: <MessageSquare className="w-8 h-8 text-accent " />,
                span: 'lg:col-span-2',
                gradient: 'from-emerald-400 to-teal-500'
              },
              {
                title: 'Design for What Comes Next',
                desc: 'Software rarely stays exactly the same. Users grow, features change and new opportunities appear. We consider that future from the beginning.',
                icon: <Compass className="w-8 h-8 text-accent " />,
                span: 'lg:col-span-3',
                gradient: 'from-accent to-purple-600',
                horizontal: true
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`group p-8 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-accent/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:bg-white/80 transition-all duration-500 relative overflow-hidden ${item.span} ${item.horizontal ? 'flex flex-col md:flex-row items-center gap-8' : ''}`}
              >
                {/* Hover gradient background effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                <div className={`mb-6 shrink-0 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg relative ${item.horizontal ? 'w-20 h-20 md:w-24 md:h-24 md:rounded-3xl' : 'w-16 h-16'}`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-inherit`} />
                  <div className="relative z-10">{item.icon}</div>
                </div>

                <div>
                  <h3 className={`font-bold font-heading mb-4 text-foreground ${item.horizontal ? 'text-2xl md:text-3xl' : 'text-xl'}`}>{item.title}</h3>
                  <p className={`text-muted-foreground leading-relaxed ${item.horizontal ? 'text-lg max-w-3xl' : ''}`}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team Section Placeholder ── */}
      <section className="py-24 bg-background border-y border-border/50">
        <div className="container mx-auto max-w-[96vw] lg:max-w-[90vw] px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-heading mb-6">The People Behind the Software</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              Great digital products are created by people who understand both the technology and the purpose behind it.
              The Clickmasters team brings together skills across software strategy, development, product design, applications, artificial intelligence, cloud technology and digital delivery.
              We believe strong projects are built through collaboration — between developers, designers, project teams and the people who understand the business best.
            </p>
            <p className="text-xl font-bold mt-8">Your team understands the opportunity.<br /><span className="text-accent">Our team helps turn it into software.</span></p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { image: '/contact/support-women.webp', name: 'Team Member Name', role: 'Leadership Role' },
              { image: '/contact/support-person.webp', name: 'Team Member Name', role: 'Leadership Role' },
              { image: '/contact/support-team.webp', name: 'Team Member Name', role: 'Leadership Role' }
            ].map((member, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-black/10 shadow-sm text-center hover:-translate-y-1 transition-transform duration-300">
                <div className="w-32 h-32 mx-auto bg-surface rounded-full mb-6 border-4 border-white shadow-md relative overflow-hidden">
                  <Image src={member.image} alt={member.name} fill className="object-cover" />
                </div>
                <h4 className="font-bold text-lg mb-1">{member.name}</h4>
                <p className="text-accent text-sm mb-4">{member.role}</p>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                  Implementation note: Add your real leadership/team members here with name, role, photograph, 2–3 line professional biography.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What Makes Us Different ── */}
      <section className="py-24 bg-surface relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto max-w-[96vw] lg:max-w-[90vw] px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-accent text-xl font-medium mb-4">
              Our Differentiator
            </span>
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">What Makes Clickmasters Different?</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'We Ask Why Before How',
                desc: 'Before deciding how to build something, we understand why it needs to exist.',
                icon: <Lightbulb className="w-6 h-6 text-accent" />
              },
              {
                title: 'We Connect Strategy and Engineering',
                desc: 'Business thinking, product decisions and software development remain connected instead of operating as separate stages.',
                icon: <Zap className="w-6 h-6 text-accent" />
              },
              {
                title: 'We Build Around Requirements',
                desc: 'Every project has different users, workflows and technical needs. We avoid forcing projects into a standard template.',
                icon: <Target className="w-6 h-6 text-accent" />
              },
              {
                title: 'We Are AI-Ready',
                desc: 'We combine established software engineering practices with modern AI capabilities where intelligent technology can add meaningful value.',
                icon: <Cpu className="w-6 h-6 text-accent" />
              },
              {
                title: 'We Keep Communication Clear',
                desc: 'Complex technology does not require unnecessarily complicated communication. We keep requirements, priorities and project stages understandable.',
                icon: <MessageSquare className="w-6 h-6 text-accent" />
              },
              {
                title: 'We Think Beyond Launch',
                desc: 'Software can continue to improve through optimisation, new functionality, integrations and ongoing development.',
                icon: <Rocket className="w-6 h-6 text-accent" />
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-4 p-8 rounded-3xl bg-white/50 backdrop-blur-sm border border-black/5 hover:border-accent/20 transition-colors shadow-xs"
              >
                <div className="mt-1 shrink-0 w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold font-heading mb-2 text-lg">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Work ── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto max-w-6xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold font-heading mb-6">Our Work Is the Best Introduction</h2>
            <p className="text-lg text-muted-foreground mb-4">
              What we build says more about Clickmasters than a long list of claims.
            </p>
            <p className="text-lg text-muted-foreground mb-4">
              Our case studies show how ideas and requirements are turned into practical software through strategy, design and engineering.
            </p>
            <div className="mb-12">
              <p className="text-lg text-muted-foreground mb-8">
                Each project starts differently, but the journey connects the same key elements:
              </p>

              <div className="mt-8 flex flex-col md:flex-row flex-wrap justify-center items-center gap-3">
                {[
                  { label: 'Challenge', icon: <Target className="w-4 h-4" /> },
                  { label: 'Requirements', icon: <Compass className="w-4 h-4" /> },
                  { label: 'Strategy', icon: <Lightbulb className="w-4 h-4" /> },
                  { label: 'Software', icon: <Cpu className="w-4 h-4" /> },
                  { label: 'Outcome', icon: <Rocket className="w-4 h-4" /> },
                ].map((step, idx, arr) => (
                  <div key={step.label} className="flex flex-col md:flex-row items-center gap-3 group">
                    <div className="flex items-center gap-3 px-5 py-3 bg-white border border-accent/20 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(var(--accent-rgb),0.15)] hover:border-accent/40 hover:-translate-y-1 transition-all duration-300 text-sm md:text-base font-semibold text-foreground">
                      <span className="p-1.5 rounded-xl bg-accent/10 text-accent">{step.icon}</span>
                      {step.label}
                    </div>
                    {idx < arr.length - 1 && (
                      <div className="hidden md:flex text-accent/30 group-hover:text-accent transition-colors">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                    {idx < arr.length - 1 && (
                      <div className="md:hidden text-accent/30 group-hover:text-accent transition-colors my-1">
                        <ArrowRight className="w-5 h-5 rotate-90" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Link href="/case-studies">
              <Button className="btn-primary px-8 py-6 text-lg rounded-xl">
                Explore Our Case Studies
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Tech Stack Section (Optional/Previous Component) ── */}
      <section className="border-t border-border">
        <TechStackSection />
      </section>

      {/* ── Trusted Clients Section (Optional/Previous Component) ── */}
      <Suspense fallback={<div className="h-64 animate-pulse bg-surface" />}>
        <TrustedClientsSection
          title="Trusted by Industry Leaders"
          subtitle="We partner with forward-thinking companies to deliver mission-critical solutions."
        />
      </Suspense>

      {/* ── CTA ── */}
      <FinalCTA />

    </main>
  );
}