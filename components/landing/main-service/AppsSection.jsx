'use client';

import React from 'react';
import { useGroupedProjects } from '@/hooks/useProjects';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { ProjectCard } from '../../admin/ProjectCard';
import { Skeleton } from '@/components/ui/skeleton';

export function AppsSection() {
  const { displayedCategories, isLoading } = useGroupedProjects();

  if (!isLoading && displayedCategories.length === 0) return null;

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-accent font-bold uppercase tracking-widest text-sm block mb-4">
            Our Solutions
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-primary tracking-tight mb-6">
            Software Solutions That <span className="text-accent">Deliver Results</span>
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Explore custom software, web applications, and software solutions we&apos;ve built for
            clients worldwide.
          </p>
        </div>

        <div className="space-y-24">
          {isLoading ? (
            <div className="space-y-12">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-48" />
                <div className="h-px flex-1 bg-border/50" />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="aspect-square rounded-2xl" />
                ))}
              </div>
            </div>
          ) : (
            displayedCategories.map(({ categoryName, projects: categoryProjects }) => (
              <div key={categoryName} className="space-y-8">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
                    {categoryName}
                  </h3>
                  <div className="h-px flex-1 bg-linear-to-r from-primary/20 to-transparent" />
                  <Badge className="bg-primary/5 text-primary border-primary/10 px-4 py-1">
                    {categoryProjects.length} Projects
                  </Badge>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {categoryProjects.map((project) => (
                    <ProjectCard key={project._id} project={project} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-20 text-center">
          <Link
            href="/software-solutions"
            className="group inline-flex items-center gap-3 bg-primary text-white px-10 py-4 rounded-xl font-bold transition-all hover:bg-accent hover:shadow-xl hover:shadow-accent/20 active:scale-95"
          >
            View All Solutions
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
