'use client';

import { useCategoryList } from '@/hooks/useCategories';
import { useProjectList } from '@/hooks/useProjects';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Globe } from 'lucide-react';

export default function CategoryDetailPage() {
  const { id } = useParams();
  const { data: categories, isLoading: loadingCategories } = useCategoryList();
  const { data: projects, isLoading: loadingProjects } = useProjectList();

  const category = categories?.find(c => c.slug === id || c._id === id);
  const categoryProjects = projects?.filter(p => p.category?._id === category?._id || p.category === category?._id);

  if (loadingCategories) {
    return (
      <div className="container py-24 space-y-8">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-6 w-full max-w-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-80 rounded-3xl" />)}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container py-40 text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Category not found</h1>
        <p className="text-slate-500 mb-8">The solution category you're looking for doesn't exist or has been moved.</p>
        <Button asChild variant="outline">
          <Link href="/solutions"><ArrowLeft className="mr-2 w-4 h-4" /> Back to Solutions</Link>
        </Button>
      </div>
    );
  }

  return (
    <main className="bg-white min-h-screen">
      <section className="bg-primary text-white py-24">
        <div className="container">
          <Link href="/solutions" className="inline-flex items-center text-accent hover:underline mb-8 font-bold uppercase tracking-widest text-xs">
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Solutions
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-heading">{category.name}</h1>
          <p className="text-xl text-white/80 max-w-3xl leading-relaxed">
            {category.description || 'Specialized software solutions engineered for maximum impact and efficiency.'}
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-primary">Related Projects</h2>
            <Badge variant="outline" className="text-slate-500 border-slate-200">
              {categoryProjects?.length || 0} Projects
            </Badge>
          </div>

          {loadingProjects ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-80 rounded-3xl" />)}
            </div>
          ) : categoryProjects?.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-500 italic">No projects found in this category yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryProjects.map((project) => (
                <Card key={project._id} className="group border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2rem] overflow-hidden bg-white flex flex-col">
                  <div className="aspect-video relative overflow-hidden bg-slate-100">
                    <img 
                      src={project.thumbnail || 'https://via.placeholder.com/800x450?text=Project'} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-primary border-none backdrop-blur-md uppercase tracking-wider text-[10px] font-bold">
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-8 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">{project.title}</h3>
                    <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-1">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags?.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter bg-slate-50 px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <Button asChild className="w-full bg-slate-900 hover:bg-primary text-white rounded-xl h-12">
                      <Link href={project.url} target="_blank">
                        View Live Project <ExternalLink className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-surface">
        <div className="container text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6">Ready to start your project?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-10 text-lg">
            Let's discuss how our {category.name.toLowerCase()} expertise can help your business scale.
          </p>
          <Button size="lg" className="bg-accent text-primary font-bold h-16 px-10 rounded-2xl" asChild>
            <Link href="/contact">Book a Strategy Call</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

import { Button } from '@/components/ui/button';
