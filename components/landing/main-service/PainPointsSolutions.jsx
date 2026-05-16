// components/sections/PainPointsSolutions.tsx
'use client';

import { useState } from 'react';
import { 
  XCircle, 
  Clock, 
  ShieldAlert, 
  TrendingUp, 
  CheckCircle2,
  ArrowRight,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const painPoints = [
  {
    id: 'cost',
    title: 'The Costly Cycle',
    description: 'You spend more maintaining legacy code than building new features. Technical debt is silently killing your margins.',
    icon: XCircle,
    gradient: 'from-primary to-rose-600',
  },
  {
    id: 'timeline',
    title: 'The Infinite Timeline',
    description: '"It’ll be ready next quarter..." Agency black-box development with zero visibility.',
    icon: Clock,
    gradient: 'from-primary to-accent',
  },
  {
    id: 'security',
    title: 'The Security Gamble',
    description: 'Vulnerable plugins and shortcuts put your customer data and reputation at constant risk.',
    icon: ShieldAlert,
    gradient: 'from-primary to-red-600',
  },
  {
    id: 'scalability',
    title: 'The Scalability Ceiling',
    description: 'Your app crashes during success. Legacy systems can’t handle real growth.',
    icon: TrendingUp,
    gradient: 'from-rose-500 to-accent',
  },
];

const solutions = [
  { title: 'Predictable ROI Architecture', description: 'Modern, maintainable stack (Node.js + React + Cloud-native) built to last.', metric: 'Up to 70% lower maintenance costs' },
  { title: 'Radical Transparency', description: 'Agile sprints with weekly demos. You always see real progress never surprises.', metric: '98% on-time delivery' },
  { title: 'Enterprise-Grade Security', description: 'OWASP Top 10, GDPR compliant, regular penetration testing by default.', metric: 'Zero security breaches' },
  { title: 'Built for 10x Growth', description: 'Auto-scaling AWS/Azure infrastructure designed for massive traffic from day one.', metric: '99.99% uptime SLA' },
];


export default function PainPointsSolutions({ countryName }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const hasLocation = !!countryName;
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-24 md:py-32 lg:px-14">
      <div className="relative mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Header */}
       

        


         <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-0.5 w-8 rounded-full bg-accent" />
            
            <div className="inline-flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-accent" />
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
                {hasLocation ? `Problems Businesses Face in ${countryName}` : 'Stop Settling For Mediocre'}
              </p>
            </div>

            <span className="h-0.5 w-8 rounded-full bg-accent" />
          </div>

          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-2xl lg:text-3xl leading-tight">
            {hasLocation 
              ? `Painful Development Realities in ${countryName} and How We Fix Them`
              : 'Painful Development Realities and How We Fix them'
            }
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            {hasLocation 
              ? 'Common challenges that hinder business growth and efficiency'
              : 'Most agencies deliver headaches wrapped in pretty proposals. Here\'s the reality and why ClickMasters approaches development differently.'
            }
          </p>
        </div>

        {/* Pain → Solution Cards */}
        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {painPoints.map((pain, idx) => {
            const Icon = pain.icon;
            const solution = solutions[idx];
            const isActive = activeIndex === idx;

            return (
              <motion.div
                key={pain.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative h-full cursor-pointer"
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <motion.div 
                  className={`relative h-full flex flex-col rounded-3xl border border-slate-100 bg-white p-8 overflow-hidden shadow-lg
                    ${isActive ? 'shadow-2xl' : 'hover:shadow-xl'}`}
                  animate={{ scale: isActive ? 1.03 : 1 }}
                  transition={{ duration: 0.4 }}
                >
                

                  {/* Icon */}
                  <motion.div 
                    className="mb-6 inline-flex rounded-2xl  p-4 text-accent"
                    whileHover={{ scale: 1.12 }}
                  >
                    <Icon className="h-8 w-8" />
                  </motion.div>

                  {/* Pain Content */}
                  <motion.div 
                    className={`transition-all duration-500 ${isActive ? 'opacity-0 scale-95' : 'opacity-100'}`}
                    animate={{ opacity: isActive ? 0 : 1, scale: isActive ? 0.95 : 1 }}
                  >
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 leading-tight">{pain.title}</h3>
                    <p className="text-slate-600 leading-relaxed font-medium">{pain.description}</p>
                  </motion.div>

                  {/* Solution Reveal */}
                  <motion.div 
                    className={`absolute inset-0 p-8 flex flex-col bg-white
                      ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                    animate={{ 
                      opacity: isActive ? 1 : 0,
                      y: isActive ? 0 : 48 
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600">
                        <CheckCircle2 className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">How We Fix It</p>
                        <p className="text-xl font-bold text-slate-900 leading-tight">{solution.title}</p>
                      </div>
                    </div>

                    <p className="text-slate-600 flex-1 leading-relaxed font-medium">{solution.description}</p>

                    {solution.metric && (
                      <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-accent/5 px-4 py-2.5 text-sm font-semibold text-accent">
                        📈 {solution.metric}
                      </div>
                    )}
                  </motion.div>

                  
                   <motion.div 
                    className="mt-auto w-full  flex items-center justify-center gap-2 rounded-2xl  py-3.5 text-xs font-semibold text-primary active:scale-95 transition-all"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >


                    Hover to see the fix
                  </motion.div>
                  
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}