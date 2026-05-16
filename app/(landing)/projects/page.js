'use client';

import { useProjectList } from '@/hooks/useProjects';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Globe, Layout, Smartphone, GitBranch, Server, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const iconMap = {
  'web': <Globe className="w-5 h-5" />,
  'mobile': <Smartphone className="w-5 h-5" />,
  'backend': <Server className="w-5 h-5" />,
  'design': <Layout className="w-5 h-5" />,
};

export default function ProjectsPage() {
  const { data: projects, isLoading } = useProjectList();

  return (
    <main className="bg-white">
      <section className="page-hero">
        <div className="container">
          <span className="section-label">PORTFOLIO</span>
          <h1>Our Project Gallery</h1>
          <p className="hero-sub text-white/90 max-w-2xl mx-auto">
            A showcase of custom software solutions, web applications, and digital products we've engineered for our global clients.
          </p>
        </div>
      </section>

      <section className="py-24 bg-surface">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-80 rounded-3xl" />)}
            </div>
          ) : !projects || projects.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900">Projects coming soon</h3>
              <p className="text-slate-500 mt-2">We're currently updating our portfolio with our latest work. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <article 
                  key={project._id} 
                  className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group opacity-0 animate-fade-up flex flex-col h-full"
                  style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
                >
                  <div className="aspect-video relative overflow-hidden bg-slate-100">
                    <Image 
                      src={project.thumbnail || 'https://via.placeholder.com/800x450?text=Project'} 
                      alt={project.title} 
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 z-10">
                      <Badge className="bg-primary/80 backdrop-blur-md text-white border-none">
                        {project.category?.name || 'Project'}
                      </Badge>
                    </div>
                    {project.status === 'live' && (
                      <div className="absolute top-4 right-4">
                        <span className="flex h-3 w-3 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-primary mb-3 leading-tight group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-text-body text-sm line-clamp-3 leading-relaxed mb-6">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-8">
                      {project.tags?.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">
                          {tag}
                        </span>
                      ))}
                      {project.tags?.length > 3 && (
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-slate-200" asChild>
                          <Link href={project.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-slate-200">
                          <GitBranch className="w-4 h-4" />
                        </Button>
                      </div>
                      <Link 
                        href={project.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:text-accent transition-colors"
                      >
                        Visit Project <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="bg-accent rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden text-primary">
            <div className="max-w-2xl mx-auto relative z-10">
              <h2 className="text-3xl md:text-5xl font-black mb-6">Have a project in mind?</h2>
              <p className="text-primary/70 text-lg mb-10 leading-relaxed font-medium">
                We're always looking for exciting new challenges. Let's build something exceptional together.
              </p>
              <Button size="lg" className="bg-primary text-accent font-bold h-16 px-12 rounded-2xl hover:bg-primary/90 shadow-xl shadow-primary/20" asChild>
                <Link href="/contact">Start a Conversation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
