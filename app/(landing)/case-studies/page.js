'use client';

import { useCaseStudyList } from '@/hooks/useCaseStudies';
import { Skeleton } from '@/components/ui/skeleton';
import { CaseStudyCard } from '@/components/admin/case-study-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CaseStudiesPage() {
  const { data: caseStudies, isLoading } = useCaseStudyList();
  const publishedStudies = caseStudies?.filter(s => s.published) || [];

  return (
    <main className="bg-white">
      <section className="page-hero">
        <div className="container">
          <span className="section-label">CASE STUDIES</span>
          <h1 className="mt-4">Proven Success Stories</h1>
          <p className="hero-sub text-white/90 max-w-2xl mx-auto">
            Explore how ClickMasters delivers measurable impact through technical excellence and strategic software engineering.
          </p>
        </div>
      </section>

      <section className="py-24 bg-surface">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-100 rounded-3xl" />)}
            </div>
          ) : publishedStudies.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900">Case studies coming soon</h3>
              <p className="text-slate-500 mt-2">We&apos;re currently preparing our latest success stories. Check back soon!</p>
              <Button asChild className="mt-8 bg-primary text-accent">
                <Link href="/contact">Start Your Project</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {publishedStudies.map((study, index) => (
                <div
                  key={study._id}
                  className="opacity-0 animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
                >
                  <CaseStudyCard
                    title={study.title}
                    excerpt={study.excerpt}
                    challenge={study.challenge}
                    results={study.results}
                    category={study.project?.category?.name || 'Project'}
                    thumbnail={study.thumbnail || study.project?.thumbnail || 'https://via.placeholder.com/800x450?text=Success+Story'}
                    href={`/case-studies/${study.slug || study._id}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-primary text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-accent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="container relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Be Our Next Success Story?</h2>
          <p className="text-white/70 mb-10 max-w-xl mx-auto text-lg">
            Let&apos;s discuss how our technical expertise can help your business achieve measurable growth.
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 bg-accent text-primary font-bold rounded-xl hover:bg-accent-light transition-all shadow-xl shadow-black/20 hover:scale-105 active:scale-95"
          >
            Start Your Journey
          </Link>
        </div>
      </section>
    </main>
  );
}
