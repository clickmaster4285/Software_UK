'use client';

import { useState, useRef } from 'react';
import {
  XCircle,
  Clock,
  ShieldAlert,
  TrendingUp,
  CheckCircle2,
  Zap,
  ArrowRight,
  MousePointer2
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const painPoints = [
  {
    id: 'cost',
    title: 'The Costly Cycle',
    description: 'Stop burning budget on technical debt. We replace legacy maintenance with high-velocity feature delivery.',
    icon: XCircle,
    color: 'var(--accent)',
  },
  {
    id: 'timeline',
    title: 'The Black Box',
    description: 'Eliminate "infinite timelines." Our agile sprints provide 100% transparency with weekly production-ready demos.',
    icon: Clock,
    color: 'var(--accent)',
  },
  {
    id: 'security',
    title: 'Security Risks',
    description: 'Vulnerable code is a liability. We embed enterprise-grade security (OWASP) into your core architecture from day one.',
    icon: ShieldAlert,
    color: 'var(--accent)',
  },
  {
    id: 'scalability',
    title: 'Growth Ceilings',
    description: 'Don\'t let your app crash during success. Our cloud-native systems are built to scale with your 10x growth.',
    icon: TrendingUp,
    color: 'var(--accent)',
  },
];

const solutions = [
  { 
    title: 'ROI-First Architecture', 
    description: 'Modern, maintainable Node.js & React stack built to lower TCO and maximize long-term ROI.', 
    metric: '70% lower maintenance' 
  },
  { 
    title: 'Radical Transparency', 
    description: 'Full Jira/GitHub access and weekly syncs. You own the process as much as the code.', 
    metric: '98% on-time delivery' 
  },
  { 
    title: 'Compliance-Ready', 
    description: 'GDPR, HIPAA, and ISO standards ready. We handle the complexity of regulated industries.', 
    metric: 'Zero data breaches' 
  },
  { 
    title: 'Auto-Scaling Infrastructure', 
    description: 'Multi-region AWS/Azure setups that handle millions of requests without breaking a sweat.', 
    metric: '99.99% Uptime SLA' 
  },
];

const FloatingParticle = ({ delay = 0, x = "0%", y = "0%", size = 4 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0.2, 0.5, 0.2], 
      scale: [1, 1.5, 1],
      y: ["0%", "-20%", "0%"],
      x: ["0%", "10%", "0%"]
    }}
    transition={{ 
      duration: 10 + Math.random() * 10, 
      repeat: Infinity, 
      delay,
      ease: "easeInOut" 
    }}
    className="absolute rounded-full bg-accent/20 blur-xl"
    style={{ left: x, top: y, width: size, height: size }}
  />
);

export default function PainPointsSolutions() {
  const [activeIndex, setActiveIndex] = useState(null);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const hasLocation = true;
  const countryName = "United Kingdom";

  return (
    <section 
      id="solutions-strategy"
      ref={containerRef}
      className="relative overflow-hidden bg-transparent py-24 md:py-32"
      aria-labelledby="solutions-heading"
    >
      {/* Premium Background Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[110%] h-[120%] opacity-40 will-change-transform"
        >
          <div className="absolute top-0 right-0 w-100 h-100 bg-accent/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-125 h-125 bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-175 bg-surface rounded-full blur-[140px]" />
        </motion.div>
        
        {/* Decorative Floating Elements */}
        <FloatingParticle x="5%" y="20%" size={100} delay={0} />
        <FloatingParticle x="80%" y="15%" size={140} delay={2} />
        <FloatingParticle x="70%" y="80%" size={180} delay={4} />
        <FloatingParticle x="2%" y="70%" size={120} delay={1} />
        
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(var(--text-muted) 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />
      </div>

      <div className="container relative z-10">
        {/* Header Section */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-6"
          >
              <span className="text-lg font-bold uppercase tracking-wide text-accent">
              {hasLocation ? `Challenges in ${countryName}` : 'Strategic Problem Solving'}
              </span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            id="solutions-heading"
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary leading-[1.1]"
          >
            {hasLocation
              ? `Realities of Software Development in ${countryName}`
              : 'Stop Settling for "Good Enough" Codebases'
            }
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="py-6 text-lg md:text-xl text-text-body font-body"
          >
            Most agencies deliver technical debt wrapped in a pretty proposal. We build 
            <span className="text-accent font-semibold"> revenue-generating systems </span> 
            engineered for long-term scale and security.
          </motion.p>
        </div>

        {/* Pain → Solution Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {painPoints.map((pain, idx) => {
            const Icon = pain.icon;
            const solution = solutions[idx];
            const isActive = activeIndex === idx;

            return (
              <motion.div
                key={pain.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group perspective-1000 h-100 cursor-pointer"
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
                aria-labelledby={`pain-title-${idx}`}
              >
                <div className={`relative h-full w-full transition-all duration-700 preserve-3d ${isActive ? 'rotate-y-180' : ''}`}>
                  
                  {/* FRONT: PAIN SIDE */}
                  <div className="absolute inset-0 backface-hidden rounded-[2rem] border border-border bg-white/40 p-8 backdrop-blur-xl shadow-sm group-hover:shadow-xl transition-all duration-500 group-hover:border-accent/20">
                    <div className="relative z-10 flex flex-col h-full">
                      {/* Icon with Glowing Aura */}
                      <div className="mb-8 relative inline-block">
                        <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700" />
                        <div className="relative w-16 h-16 flex items-center justify-center rounded-2xl bg-surface border border-border transition-colors duration-300">
                          <Icon className="h-8 w-8 text-text-primary group-hover:text-accent transition-colors duration-300" strokeWidth={1.5} />
                        </div>
                      </div>

                      <h3 id={`pain-title-${idx}`} className="font-heading text-2xl font-bold text-text-primary mb-4 leading-tight">
                        {pain.title}
                      </h3>
                      
                      <p className="text-text-body text-sm leading-relaxed font-body">
                        {pain.description}
                      </p>

                      <div className="mt-auto flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-accent/60 group-hover:text-accent transition-colors">
                        <MousePointer2 className="h-3 w-3" />
                        See Our Solution
                      </div>
                    </div>

                    {/* Subtle corner accent */}
                    <div className="absolute bottom-4 right-4 w-8 h-8 opacity-10">
                      <div className="w-full h-full border-b-2 border-r-2 border-text-primary rounded-br-lg" />
                    </div>
                  </div>

                  {/* BACK: SOLUTION SIDE */}
                  <div className="absolute inset-0 rotate-y-180 backface-hidden rounded-[2rem] border-2 border-accent/20 bg-primary p-8 shadow-2xl overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/20 blur-3xl rounded-full" />
                    
                    <div className="relative z-10 flex flex-col h-full text-white">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-white shadow-lg shadow-accent/20">
                          <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-accent/80">The Fix</p>
                          <h4 className="font-heading text-lg font-bold leading-tight">{solution.title}</h4>
                        </div>
                      </div>

                      <p className="text-white/80 text-sm leading-relaxed font-body mb-6">
                        {solution.description}
                      </p>

                      <div className="mt-auto space-y-4">
                        <div className="inline-flex items-center gap-3 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold backdrop-blur-md border border-white/10">
                          <TrendingUp className="h-4 w-4 text-accent" />
                          <span>{solution.metric}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs font-semibold text-accent group-hover:translate-x-1 transition-transform">
                          Contact Our Team <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Global SEO Footer for section */}
        <div className="mt-16 text-center lg:mt-24">
          <p className="text-sm text-text-muted font-body">
            Engineering excellence for visionary brands. Built with security, performance, and ROI in mind.
          </p>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </section>
  );
}
