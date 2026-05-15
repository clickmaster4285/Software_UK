'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { apiFetch } from '@/lib/api';
import { getCategoryName, resolveImageUrl } from '@/lib/utils';
import { FolderKanban, ArrowRight } from 'lucide-react';

function groupProjectsByCategory(projects) {
  const map = new Map();

  for (const project of projects) {
    const name = getCategoryName(project.category);
    if (!map.has(name)) map.set(name, []);
    map.get(name)!.push(project);
  }

  return Array.from(map.entries())
    .map(([categoryName, projects]) => ({ categoryName, projects }))
    .sort((a, b) => a.categoryName.localeCompare(b.categoryName));
}

export function AppsSection() {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects-public'],
    queryFn: async () => {
      const res = await apiFetch('/api/projects');
      if (!res.ok) throw new Error('Failed to fetch projects');
      return res.json();
    },
    staleTime: 300000,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories-public'],
    queryFn: async () => {
      const res = await apiFetch('/api/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      return res.json();
    },
    staleTime: 300000,
  });

  const visibleCategoryNames = new Set(
    categories.filter((c) => c.showOnHome).map((c) => c.name)
  );

  const displayedCategories = groupProjectsByCategory(
    projects.filter((p) => visibleCategoryNames.has(getCategoryName(p.category)))
  )
    .map((category) => ({
      ...category,
      projects: category.projects.slice(0, 4),
    }))
    .filter((category) => category.projects.length > 0);

  if (!isLoading && displayedCategories.length === 0) return null;

  if (isLoading) {
    return (
      <section className="py-6 bg-white">
        <div className="container mx-auto  px-4 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-gray-600">Loading solutions...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 bg-white">
      <div className="container mx-auto  px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Our Solutions</h2>
          <p className="text-gray-700 text-lg">
            Explore custom software, web applications, and software solutions we've built for
            clients worldwide.
          </p>
        </div>

        <div className="space-y-16">
          {displayedCategories.map(({ categoryName, projects: categoryProjects }) => (
            <div key={categoryName} className="space-y-6">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold text-black">{categoryName}</h3>
                <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
                <Badge className="bg-primary/10 text-primary border-0">
                  {categoryProjects.length}
                </Badge>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categoryProjects.map((project) => (
                  <Link
                    key={project._id}
                    href={project.url?.startsWith('http') ? project.url : `/software-solutions/${project._id}`}
                    target={project.url?.startsWith('http') ? '_blank' : undefined}
                    rel={project.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="group block"
                  >
                    <div className="bg-white rounded-2xl border border-primary/10 overflow-hidden transition-shadow hover:shadow-lg">
                      <div className="aspect-video bg-gradient-to-br from-primary/5 to-primary/10 relative overflow-hidden">
                        {project.thumbnail ? (
                          <Image
                            src={resolveImageUrl(project.thumbnail)}
                            alt={`${project.title} project thumbnail`}
                            fill
                            sizes="(max-width) 100vw, (max-width) 50vw, 25vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <FolderKanban className="h-10 w-10 text-primary/30" />
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <h3 className="font-semibold text-black mb-2 line-clamp-1">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/software-solutions"
            className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center gap-2 rounded-md bg-black px-8 py-3 text-center font-medium text-white transition-colors hover:bg-primary"
          >
            View all solutions
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}