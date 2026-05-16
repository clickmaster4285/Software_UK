'use client';

import { useParams } from 'next/navigation';
import { useTestimonial } from '@/hooks/useTestimonials';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Quote, Calendar, Building2, Briefcase, ChevronRight, Share2, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default function TestimonialDetailPage() {
  const { id } = useParams();
  const { data: testimonial, isLoading, error } = useTestimonial(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-white to-slate-50 pt-32 pb-24">
        <div className="container max-w-4xl">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-16 shadow-lg">
            <div className="flex items-center gap-6 mb-12">
              <Skeleton className="w-20 h-20 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-32 w-full mb-8" />
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="w-6 h-6" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !testimonial) {
    return notFound();
  }

  return (
    <main className="bg-linear-to-b from-white to-slate-50 min-h-screen pt-32 pb-24">
      <article className="container max-w-4xl">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-12">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/testimonials" className="hover:text-primary transition-colors">Testimonials</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-medium truncate">{testimonial.authorName}</span>
        </nav>

        {/* Header */}
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-bold">
              Client Testimonial
            </div>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary mb-8 leading-[1.1] tracking-tight">
            {testimonial.authorName}
          </h1>

          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-linear-to-br from-primary to-primary-mid overflow-hidden border-2 border-white shadow-lg">
                    {testimonial.avatarUrl ? (
                      <Image src={testimonial.avatarUrl} alt={testimonial.authorName} fill sizes="64px" className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-accent font-bold text-lg">
                        {testimonial.authorName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Client</div>
                  <div className="text-xl font-bold text-slate-900">{testimonial.authorName}</div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                    {testimonial.authorRole && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {testimonial.authorRole}
                      </span>
                    )}
                    {testimonial.authorCompany && (
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {testimonial.authorCompany}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < testimonial.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200'
                        }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-bold text-slate-700">{testimonial.rating}/5</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="rounded-xl border-slate-200 hover:bg-primary hover:text-accent hover:border-primary transition-all">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-16 shadow-lg mb-16 relative">
          {/* Quote Icon */}
          <div className="absolute top-8 right-8 w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Quote className="w-8 h-8 text-primary" />
          </div>

          {/* Testimonial Content */}
          <blockquote className="text-2xl md:text-3xl leading-relaxed text-slate-700 font-medium mb-12 relative">
            &quot;{testimonial.content}&quot;
          </blockquote>

          {/* Additional Info */}
          <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
            <div className="bg-slate-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-slate-900">Project Timeline</h3>
              </div>
              <p className="text-slate-600">
                This testimonial represents the successful completion of our project collaboration,
                demonstrating the value and quality we deliver to every client.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-slate-900">Client Satisfaction</h3>
              </div>
              <p className="text-slate-600">
                Our commitment to excellence is reflected in this client&apos;s feedback,
                showcasing our dedication to exceeding expectations.
              </p>
            </div>
          </div>
        </div>

        {/* Related Testimonials */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">More Client Stories</h2>
          <div className="bg-linear-to-r from-primary to-primary-mid rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-64 h-64 bg-accent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4">Ready to Share Your Success Story?</h3>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                Join our growing list of satisfied clients who have transformed their business with our solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" className="bg-accent text-primary hover:bg-accent-hover px-8 py-4 text-lg font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl">
                    Start Your Project
                  </Button>
                </Link>
                <Link href="/testimonials">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-bold rounded-xl transition-all">
                    View All Testimonials
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
