'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Phone, MessageSquare, Shield, Target, Compass, Lock, CheckCircle2 } from 'lucide-react';
import JsonLd from '@/components/JsonLd';
import { contactPageSchema } from '@/app/metadata-config';
import { Button } from '@/components/ui/button';
import ContactForm from './ContactForm';


export default function ContactPageContent() {
  return (
    <main className="min-h-screen bg-background relative overflow-x-hidden">
      <JsonLd schema={contactPageSchema()} />
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-end justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/contact/contact-bg.webp"
            alt="Contact ClickMasters"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 container mx-auto max-w-7xl px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-left"
          >
            <h1 className="text-5xl xl:text-[4.7rem] font-bold mb-6 tracking-tight font-heading">
              <span className="text-white">Let&apos;s Talk About Your</span>
              <span className="text-accent block mt-2">Software Project</span>
            </h1>

            <p className="text-xl text-white/90 max-w-7xl mx-auto mb-10 leading-relaxed">
              Have an idea you want to build, an existing product you want to improve or a digital opportunity you are ready to explore?
              <br />
              Tell ClickMasters what you are working on.
              <br />
              You do not need a complete technical specification before contacting us. Share the idea, requirement or problem you have today, and we can start by understanding what you want to achieve.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="#contact-form">
                <Button className="px-8 py-5 bg-accent text-white font-medium rounded-xl hover:bg-accent-hover transition-colors flex items-center gap-2">
                  Discuss Your Project
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="tel:+447988576086">
                <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white hover:border-white/50">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section id="contact-form" className="py-24 relative bg-background">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto max-w-[96vw] lg:max-w-[90vw] px-6 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-medium text-sm mb-6 border border-accent/20">
              Get Started
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-heading">
              Tell Us What You <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-600">Want to Build</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Give us enough information to understand where you are in your project and what kind of support you need.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_450px] gap-12 items-start max-w-7xl mx-auto">
            {/* Left: Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="rounded-3xl bg-white/60 backdrop-blur-xl border border-black/10 p-8 md:p-10 shadow-xl relative"
            >
              <ContactForm />

              <div className="mt-8 pt-6 border-t border-border text-sm text-muted-foreground flex flex-col items-center justify-center gap-3 text-center">
                <Shield className="w-5 h-5 text-accent" />
                <p className="max-w-md">
                  By submitting your details, you agree that ClickMasters may contact you regarding your enquiry.{' '}
                  <Link href="/privacy-policy" className="text-accent hover:underline font-medium">Privacy Policy</Link>
                </p>
              </div>
            </motion.div>

            {/* Right: Contact Direct & NDA */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="rounded-3xl bg-surface border border-border p-8 md:p-10 shadow-sm">
                <h3 className="text-2xl font-bold text-foreground mb-6 font-heading">Prefer to Contact Us Directly?</h3>
                <p className="text-muted-foreground mb-8">For project and general enquiries, you can reach out to us at:</p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Email</h4>
                      <a href="mailto:sale@clickmasterssoftwaredevelopmentcompany.co.uk" className="text-muted-foreground hover:text-accent transition-colors font-medium break-all">
                        sale@clickmasterssoftwaredevelopmentcompany.co.uk
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Phone</h4>
                      <a href="tel:+447988576086" className="text-muted-foreground hover:text-accent transition-colors font-medium">
                        +44 7988 576086
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl p-8 md:p-10 bg-primary text-white shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-20 mix-blend-overlay" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20">
                    <Lock className="w-6 h-6 text-blue-300" />
                  </div>
                  <h3 className="text-2xl font-bold font-heading mb-4">Your Ideas Stay Part of the Conversation</h3>
                  <p className="text-white/80 leading-relaxed mb-8">
                    We understand that early-stage product ideas, business processes and technical requirements may contain information you do not want shared publicly. Project discussions are handled professionally and used to understand your enquiry.
                  </p>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-200 bg-white/5 px-4 py-3 rounded-full border border-white/10">
                    <Shield className="w-4 h-4" /> NDA available on request
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── What Happens After You Contact Us? ── */}
      <section className="py-32 bg-background relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-accent/5 rounded-[100%] blur-[100px] pointer-events-none" />

        <div className="container mx-auto max-w-[96vw] lg:max-w-[90vw] px-6 relative z-10">
          <div className="text-center mb-24 relative">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-medium text-sm mb-6 border border-accent/20">
              Our Process
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-heading">
              What Happens After You <span className="text-accent">Contact Us?</span>
            </h2>
            <p className="text-xl max-w-2xl mx-auto font-medium text-muted-foreground">
              No unnecessary complexity. Just a clearer path forward.
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-[48px] left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-transparent via-accent/30 to-transparent rounded-full" />
            
            <div className="grid md:grid-cols-3 gap-12 md:gap-8 relative z-10">
              {[
                {
                  step: '1',
                  title: 'We Review',
                  subtitle: 'Your Requirements',
                  desc: 'We look at the information you provide to understand the idea, current situation and outcome you want to achieve.',
                  icon: <Target className="w-8 h-8 text-accent" />,
                  gradient: 'from-blue-500 to-accent',
                  delay: 0
                },
                {
                  step: '2',
                  title: 'We Talk',
                  subtitle: 'About the Project',
                  desc: 'A conversation helps us understand your users, priorities, functionality, existing technology and any important project constraints.',
                  icon: <MessageSquare className="w-8 h-8 text-accent" />,
                  gradient: 'from-accent to-purple-600',
                  delay: 0.15
                },
                {
                  step: '3',
                  title: 'We Define',
                  subtitle: 'The Next Step',
                  desc: 'If the project is a good fit, we can recommend the most appropriate next stage — whether that is further discovery, technical planning or moving towards development.',
                  icon: <Compass className="w-8 h-8 text-accent" />,
                  gradient: 'from-purple-500 to-pink-500',
                  delay: 0.3
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: item.delay }}
                  viewport={{ once: true }}
                  className="relative group h-full"
                >
                  <div className="h-full bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-black/5 hover:border-accent/20 transition-all duration-500 flex flex-col relative overflow-hidden">
                    
                    {/* Subtle Corner Glow */}
                    <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700 rounded-full`} />
                    
                    <div className="flex items-start justify-between mb-8 relative z-10">
                       <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${item.gradient} shadow-lg text-white group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shrink-0`}>
                         {item.icon}
                       </div>
                       <div className="text-6xl font-black text-black/5 group-hover:text-accent/10 transition-colors duration-500 font-heading leading-none">
                         0{item.step}
                       </div>
                    </div>
                    
                    <div className="mt-auto relative z-10">
                      <h3 className="text-2xl font-bold font-heading mb-3 text-foreground group-hover:text-accent transition-colors duration-300">
                        {item.title} {item.subtitle}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                        {item.desc}
                      </p>
                    </div>
                    
                    {/* Animated Bottom Border */}
                    <div className={`absolute bottom-0 inset-x-0 h-1.5 bg-gradient-to-r ${item.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Not Sure Where to Start? ── */}
      <section className="py-32 relative overflow-hidden" style={{ background: 'oklch(0.99 0.005 250)' }}>
        {/* Animated wave background from About page */}
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
          <div className="blob-drift absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-40" style={{ background: 'radial-gradient(circle, oklch(0.5675 0.2072 318.97 / 0.18) 0%, transparent 70%)' }} />
          <div className="blob-drift absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-30" style={{ background: 'radial-gradient(circle, oklch(0.5675 0.2072 318.97 / 0.14) 0%, transparent 70%)', animationDelay: '-6s' }} />
          <svg className="wave-slow absolute bottom-0 left-0 w-full opacity-70" style={{ height: '220px' }} viewBox="0 0 1440 220" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,120 C240,180 480,60 720,120 C960,180 1200,60 1440,120 L1440,220 L0,220 Z" fill="oklch(0.5675 0.2072 318.97 / 0.08)" /></svg>
        </div>

        <div className="container mx-auto max-w-[96vw] lg:max-w-[90vw] px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-8 tracking-tight">
                Not Sure <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-600">Where to Start?</span>
              </h2>
              <div className="text-xl text-muted-foreground leading-relaxed mb-8 space-y-6">
                <p className="font-medium text-foreground">That is completely fine.</p>
                <p>Many software projects begin with questions rather than detailed specifications.</p>
                <div className="p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-accent/20 border-l-4 border-l-accent shadow-sm inline-block">
                  <p className="text-foreground font-medium italic">Start with what you know. We can help turn it into a clearer software requirement.</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white/60 backdrop-blur-2xl border border-white/60 p-8 md:p-12 rounded-[2.5rem] shadow-xl"
            >
              <h3 className="text-2xl font-bold mb-8 font-heading text-foreground">You may know that:</h3>
              <ul className="space-y-5">
                {[
                  'A process needs improving',
                  'Existing software is holding the business back',
                  'You want to launch a new product',
                  'You need a web or mobile application',
                  'You want to explore AI opportunities',
                  'Several systems need to work together',
                  'An existing platform needs further development'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="mt-1 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 border border-accent/20">
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                    </div>
                    <span className="text-lg text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-32 bg-primary text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-10 mix-blend-overlay" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/20 rounded-full blur-[150px]" />

        <div className="container mx-auto max-w-4xl px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-8 leading-tight">Start With a Conversation</h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed font-medium">
              You may have a complete product roadmap or just the beginning of an idea. Either is enough to start.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mb-8 opacity-50" />
            <p className="text-lg text-white/70 mb-12 leading-relaxed max-w-2xl mx-auto">
              Tell us what you want to build, improve or explore, and let’s find the right way to move it forward.
            </p>
            <Link href="#contact-form">
              <Button className="bg-white text-primary hover:bg-gray-100 px-10 py-7 text-lg rounded-2xl font-bold shadow-xl hover:-translate-y-1 transition-transform">
                Discuss Your Software Project
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
