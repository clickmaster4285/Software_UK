'use client';

import { useTestimonialList } from '@/hooks/useTestimonials';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Star, Quote, ArrowRight } from 'lucide-react';

function TestimonialCard({ testimonial }) {
  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
      {/* Quote Icon */}
      <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Quote className="w-6 h-6" fill="currentColor" />
      </div>

      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${i < testimonial.rating
                ? 'fill-amber-400 text-amber-400'
                : 'text-slate-200'
              }`}
          />
        ))}
      </div>

      {/* Content */}
      <blockquote className="text-slate-700 mb-6 text-lg leading-relaxed font-medium">
        "{testimonial.content}"
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-linear-to-br from-primary to-primary-mid flex items-center justify-center text-accent font-bold text-xl shadow-lg">
          {testimonial.authorName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
        </div>
        <div>
          <div className="font-bold text-slate-900 text-lg">{testimonial.authorName}</div>
          <div className="text-slate-500 text-sm">
            {testimonial.authorRole}
            {testimonial.authorCompany && (
              <span className="text-slate-400"> • {testimonial.authorCompany}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TestimonialSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-5 h-5" />
        ))}
      </div>
      <Skeleton className="h-24 mb-6" />
      <div className="flex items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsPage() {
  const { data: testimonials, isLoading } = useTestimonialList();

  const activeTestimonials = testimonials?.filter(t => t.isActive) || [];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="py-24 bg-linear-to-br from-primary to-primary-mid text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-accent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Client Testimonials</h1>
            <p className="text-white/80 text-xl mb-8 leading-relaxed">
              Don't just take our word for it. Hear directly from the amazing clients we've had the privilege to work with.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                <div className="text-3xl font-bold text-accent">{activeTestimonials.length}</div>
                <div className="text-sm text-white/70">Happy Clients</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                <div className="text-3xl font-bold text-accent">4.9</div>
                <div className="text-sm text-white/70">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-24">
        <div className="container">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <TestimonialSkeleton key={i} />
              ))}
            </div>
          ) : activeTestimonials.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {activeTestimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial._id} testimonial={testimonial} />
                ))}
              </div>

              {/* CTA Section */}
              <div className="text-center bg-linear-to-r from-primary to-primary-mid rounded-3xl p-12 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="absolute top-0 left-0 w-64 h-64 bg-accent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                </div>
                <div className="relative z-10">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Ready to Join Our Success Stories?
                  </h2>
                  <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                    Let's discuss how our technical expertise can help transform your business and achieve remarkable results.
                  </p>
                  <Link href="/contact">
                    <Button size="lg" className="bg-accent text-primary hover:bg-accent-hover px-8 py-4 text-lg font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl">
                      Start Your Journey
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Quote className="w-12 h-12 text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">No Testimonials Yet</h3>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                We're just getting started! Check back soon to hear from our amazing clients.
              </p>
              <Link href="/contact">
                <Button className="bg-primary text-accent hover:bg-primary/90">
                  Be Our First Client
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
