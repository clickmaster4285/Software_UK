'use client';

import { useTestimonialList } from '@/hooks/useTestimonials';
import { Star, Quote } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Testimonials() {
  const { data: testimonials, isLoading } = useTestimonialList();
  const activeTestimonials = testimonials?.filter(t => t.isActive) || [];

  if (isLoading) {
    return (
      <section className="py-24 bg-white">
        <div className="max-w-400 mx-auto px-6">
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
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-400 mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-primary mb-4 tracking-tight">
            Client Success Stories
          </h2>
          <p className="text-text-body font-body max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our partners say about working with ClickMasters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeTestimonials.map((t) => (
            <div 
              key={t._id} 
              className="bg-slate-50 p-8 rounded-2xl border border-slate-100 relative group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="absolute -top-4 -left-4 bg-accent text-primary p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <Quote className="w-5 h-5 fill-current" />
              </div>
              
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-4 h-4 fill-current text-yellow-400" 
                  />
                ))}
              </div>

              <blockquote className="text-slate-700 font-body leading-relaxed mb-8 italic">
                "{t.content}"
              </blockquote>

              <div className="flex items-center gap-4 border-t border-slate-200 pt-6">
                {t.avatarUrl ? (
                  <img 
                    src={t.avatarUrl} 
                    alt={t.authorName} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {t.authorName[0]}
                  </div>
                )}
                <div>
                  <div className="font-bold text-slate-900">{t.authorName}</div>
                  <div className="text-xs text-slate-500">{t.authorRole} {t.authorCompany && `at ${t.authorCompany}`}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
