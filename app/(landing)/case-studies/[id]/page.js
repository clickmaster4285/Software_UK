'use client';

import { useParams } from 'next/navigation';
import { useCaseStudy } from '@/hooks/useCaseStudies';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target, Lightbulb, CheckCircle2, ChevronRight, Share2, Printer } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default function CaseStudyDetailPage() {
  const { id } = useParams();
  const { data: study, isLoading, error } = useCaseStudy(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-24">
        <div className="container">
          <Skeleton className="h-10 w-48 mb-8" />
          <Skeleton className="h-20 w-3/4 mb-12" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <Skeleton className="h-100 w-full rounded-3xl" />
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-96 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !study) {
    return notFound();
  }

  return (
    <main className="bg-linear-to-b from-white to-slate-50 min-h-screen pt-32 pb-24">
      <article className="container max-w-6xl">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-12">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/case-studies" className="hover:text-primary transition-colors">Case Studies</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-medium truncate">{study.title}</span>
        </nav>

        {/* Hero Section */}
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <Badge className="bg-accent text-primary hover:bg-accent/90 px-4 py-2 text-sm font-bold">
              {study.project?.category?.name || 'Success Story'}
            </Badge>
            <div className="h-px bg-slate-200 flex-1"></div>
            <Badge className="bg-emerald-100 text-emerald-700 px-4 py-2 text-sm font-bold">
              {study.status}
            </Badge>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary mb-8 leading-[1.1] tracking-tight">
            {study.title}
          </h1>

          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Client</div>
                  <div className="text-lg font-bold text-slate-900">{study.client || 'Confidential'}</div>
                </div>
              </div>

              {study.project && (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
                    <Lightbulb className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Solution</div>
                    <div className="text-lg font-bold text-slate-900">{study.project.title}</div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-xl border-slate-200 hover:bg-primary hover:text-accent hover:border-primary transition-all">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-xl border-slate-200 hover:bg-primary hover:text-accent hover:border-primary transition-all">
                  <Printer className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 mb-16 aspect-video">
          <Image
            src={study.thumbnail || study.project?.thumbnail || 'https://via.placeholder.com/1200x600?text=Case+Study'}
            alt={study.title || 'Case study image'}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent"></div>
        </div>

        {/* Overview */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-primary mb-6">Project Overview</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">{study.excerpt}</p>

          {/* Technologies */}
          {study.technologies?.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">Technologies Used</h3>
              <div className="flex flex-wrap gap-3">
                {study.technologies.map(tech => (
                  <Badge key={tech} variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-primary hover:text-accent border border-slate-200 px-4 py-2 text-sm font-medium transition-all">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Challenge, Approach, Results Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-linear-to-br from-red-50 to-red-100 rounded-3xl p-8 border border-red-200">
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center text-white mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-red-900 mb-4">The Challenge</h3>
            <p className="text-red-700 leading-relaxed">{study.challenge}</p>
          </div>

          <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-3xl p-8 border border-blue-200">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white mb-6">
              <Lightbulb className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Our Approach</h3>
            <p className="text-blue-700 leading-relaxed">{study.approach}</p>
          </div>

          <div className="bg-linear-to-br from-emerald-50 to-emerald-100 rounded-3xl p-8 border border-emerald-200">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white mb-6">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-900 mb-4">The Results</h3>
            <p className="text-emerald-700 leading-relaxed">{study.results}</p>
          </div>
        </div>

        {/* Project Details */}
        {study.project && (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-lg mb-16">
            <h2 className="text-3xl font-bold text-primary mb-8">Related Solution</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{study.project.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-6">{study.project.description}</p>
                <div className="flex flex-wrap gap-3">
                  {study.project.tags?.map(tag => (
                    <Badge key={tag} variant="outline" className="border-slate-200 text-slate-600">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Category</div>
                    <div className="text-lg font-bold text-slate-900">{study.project.category?.name}</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Status</div>
                    <div className="text-lg font-bold text-slate-900">{study.project.status}</div>
                  </div>
                  {study.project.url && (
                    <div>
                      <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Live URL</div>
                      <Link
                        href={study.project.url}
                        target="_blank"
                        className="text-primary hover:text-accent transition-colors font-medium"
                      >
                        View Project →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-linear-to-r from-primary to-primary-mid rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-64 h-64 bg-accent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Let&apos;s discuss how our technical expertise can help you achieve remarkable results like this case study.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-accent text-primary hover:bg-accent-hover px-8 py-4 text-lg font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl">
                  Start Your Project
                </Button>
              </Link>
              <Link href="/case-studies">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-bold rounded-xl transition-all">
                  View All Case Studies
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
