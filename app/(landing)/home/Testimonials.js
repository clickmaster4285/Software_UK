'use client';

import { useTestimonialList } from '@/hooks/useTestimonials';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Testimonials() {
  const { data: testimonials, isLoading } = useTestimonialList();
  const activeTestimonials = testimonials?.filter(t => t.isActive) || [];

  const shouldAnimate = activeTestimonials.length > 3;
  const duplicatedTestimonials = shouldAnimate ? [...activeTestimonials, ...activeTestimonials] : activeTestimonials;

  if (isLoading) {
    return (
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (activeTestimonials.length === 0) return null;

  return (
    <section className="py-24 bg-primary overflow-hidden relative">
      {/* Decorative Background using global colors */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,var(--accent-light),transparent_50%)] opacity-10" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,var(--primary-light),transparent_50%)] opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-accent text-sm font-medium uppercase tracking-[0.08em] mb-4 border border-white/10 backdrop-blur-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Trusted by 50+ Global Brands</span>
          </div>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mb-4 tracking-tight">
            Our Clients Speak for Us
          </h2>
          <p className="text-white/60 font-body max-w-2xl mx-auto text-lg leading-relaxed">
            Join hundreds of satisfied partners who have scaled their businesses with our custom software solutions.
          </p>
        </div>

        {/* Conditional Layout: Marquee for > 3, Grid for <= 3 */}
        {shouldAnimate ? (
          <div className="relative flex overflow-hidden py-10 group">
            <motion.div 
              className="flex gap-8 whitespace-nowrap"
              animate={{ x: [0, -100 * activeTestimonials.length + '%'] }}
              transition={{ 
                duration: activeTestimonials.length * 20, // Doubled duration for subtle slow effect
                ease: "linear", 
                repeat: Infinity 
              }}
            >
              {duplicatedTestimonials.map((t, idx) => (
                <TestimonialCard key={`${t._id}-${idx}`} t={t} className="w-87.5 md:w-112.5 shrink-0" />
              ))}
            </motion.div>

            {/* Fade Gradients for Marquee */}
            <div className="absolute top-0 left-0 w-32 h-full bg-linear-to-r from-primary to-transparent z-20 pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-full bg-linear-to-l from-primary to-transparent z-20 pointer-events-none" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto py-10">
            {activeTestimonials.map((t) => (
              <TestimonialCard key={t._id} t={t} className="w-full" />
            ))}
          </div>
        )}
        
        {/* Trust Logos or Stats Bar */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-80 grayscale hover:grayscale-0 transition-all duration-700">
          <div className="text-white/80 font-heading font-bold text-sm tracking-[0.175em] uppercase">TRUSTED BY</div>
          <div className="h-px w-12 bg-white/10" />
          <div className="flex flex-wrap gap-12 items-center justify-center">
            <span className="text-white font-heading font-black text-2xl italic tracking-tighter">TECHCORP</span>
            <span className="text-white font-heading font-black text-2xl italic tracking-tighter">QUANTUM</span>
            <span className="text-white font-heading font-black text-2xl italic tracking-tighter">NEXUS</span>
            <span className="text-white font-heading font-black text-2xl italic tracking-tighter">SKYLINE</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ t, className }) {
  return (
    <div className={`${className} bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl relative hover:bg-white/10 transition-colors duration-500 group/card`}>
      <div className="absolute -top-4 -left-4 bg-accent text-white p-3 rounded-2xl shadow-xl group-hover/card:scale-110 transition-transform duration-500">
        <Quote className="w-5 h-5 fill-current" />
      </div>
      
      <div className="flex gap-1 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i} 
            className="w-4 h-4 fill-current text-yellow-500/80" 
          />
        ))}
      </div>

      <blockquote className="text-white/80 font-body leading-relaxed mb-8 italic whitespace-normal text-lg">
        "{t.content}"
      </blockquote>

      <div className="flex items-center gap-4 border-t border-white/5 pt-6">
        {t.avatarUrl ? (
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 shadow-xl">
            <Image 
              src={t.avatarUrl} 
              alt={t.authorName} 
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold border border-accent/30">
            {t.authorName[0]}
          </div>
        )}
        <div>
          <div className="font-heading font-bold text-white text-lg leading-tight">{t.authorName}</div>
          <div className="text-sm text-white/40 font-body">{t.authorRole} {t.authorCompany && `at ${t.authorCompany}`}</div>
        </div>
      </div>
    </div>
  );
}
