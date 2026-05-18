'use client';

import React from 'react';
import { useGroupedProjects } from '@/hooks/useProjects';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProjectCard } from '@/components/admin/ProjectCard';
import { Skeleton } from '@/components/ui/skeleton';

function ProjectCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-primary/8 shadow-[0_2px_16px_rgba(0,0,0,0.07)]">
      <Skeleton className="aspect-4/3 w-full rounded-none" />
      <div className="space-y-3 p-5 sm:p-6">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center justify-between border-t border-primary/8 pt-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function AppsSection() {
  const { displayedCategories, isLoading } = useGroupedProjects();

  if (!isLoading && displayedCategories.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-surface py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, color-mix(in oklch, var(--primary) 12%, transparent) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />
      <div
        className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-accent/8 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-10 h-80 w-80 rounded-full bg-primary/5 blur-3xl"
        aria-hidden
      />

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto mb-20  text-center">
          <div className="mb-4 inline-flex items-center gap-2">
            <span className="text-lg font-bold uppercase tracking-[0.2em] text-accent">
              Our Solutions
            </span>
          </div>
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-primary md:text-5xl">
            Software Solutions That{' '}
            <span className="bg-linear-to-r from-accent to-accent-hover bg-clip-text text-transparent">
              Deliver Results
            </span>
          </h2>
          <p className="text-lg leading-relaxed text-text-primary/65">
            Explore custom software, web applications, and software solutions we&apos;ve built for
            clients worldwide.
          </p>
        </div>

        <div className="space-y-20">
          {isLoading ? (
            <div className="space-y-12">
              <div className="flex items-center gap-4">
                <Skeleton className="h-9 w-56" />
                <div className="h-px flex-1 bg-primary/10" />
                <Skeleton className="h-8 w-28 rounded-full" />
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
                {[1, 2, 3, 4].map((i) => (
                  <ProjectCardSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : (
            displayedCategories.map(({ categoryName, projects: categoryProjects }) => (
              <div key={categoryName} className="space-y-8">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="hidden h-px min-w-15 flex-1 bg-linear-to-r from-primary/15 to-transparent sm:block" />
                  <span className="rounded-full border border-primary/10 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary/70 shadow-sm">
                    {categoryProjects.length}{' '}
                    {categoryProjects.length === 1 ? 'Project' : 'Projects'}
                  </span>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
                  {categoryProjects.map((project) => (
                    <ProjectCard key={project._id} project={project} variant="featured" />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* <div className="mt-20 text-center">
          <Link
            href="/software-solutions"
            className="group inline-flex items-center gap-3 rounded-xl bg-linear-to-r from-primary to-primary-mid px-10 py-4 font-bold text-white shadow-lg shadow-primary/15 transition-all hover:from-accent hover:to-accent-hover hover:shadow-xl hover:shadow-accent/20 active:scale-[0.98]"
          >
            View All Solutions
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div> */}
      </div>
    </section>
  );
}
