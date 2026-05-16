'use client';

import { useCategoryList } from '@/hooks/useCategories';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowRight, Code2, Cpu, BarChart3, Workflow, ShieldCheck, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';

const iconMap = {
  'workflow-tools': <Workflow className="w-6 h-6" />,
  'automation': <Cpu className="w-6 h-6" />,
  'analytics': <BarChart3 className="w-6 h-6" />,
  'creative-studio': <Palette className="w-6 h-6" />,
  'security': <ShieldCheck className="w-6 h-6" />,
  'software-development': <Code2 className="w-6 h-6" />,
};

export default function SolutionsPage() {
  const { data: categories, isLoading } = useCategoryList();
  const activeCategories = categories?.filter(c => !c.deleted) || [];

  return (
    <main className="bg-white">
      <section className="page-hero">
        <div className="container">
          <span className="section-label">OUR SOLUTIONS</span>
          <h1>Your Solution for Every Challenge</h1>
          <p className="hero-sub text-white/90 max-w-2xl mx-auto">
            Powerful software tools designed to transform how your business operates and scales in the digital age.
          </p>
        </div>
      </section>

      <section className="py-24 bg-surface">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-64 rounded-3xl" />)}
            </div>
          ) : activeCategories.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900">Solutions coming soon</h3>
              <p className="text-slate-500 mt-2">We&apos;re currently expanding our specialized expertise. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeCategories.map((solution, index) => (
                <Link
                  key={solution._id}
                  href={`/solutions/${solution.slug || solution._id}`}
                  className="block group opacity-0 animate-fade-up h-full"
                  style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
                >
                  <Card className="h-full bg-white rounded-[2rem] border-slate-100 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/5 group-hover:-translate-y-1 flex flex-col overflow-hidden">
                    <CardContent className="p-10 flex-1">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:bg-accent group-hover:text-primary transition-colors duration-500">
                        {iconMap[solution.slug] || <Code2 className="w-6 h-6" />}
                      </div>
                      <h3 className="text-2xl font-bold text-primary mb-4 leading-tight group-hover:text-accent transition-colors">
                        {solution.name}
                      </h3>
                      <CardDescription className="text-text-body text-base leading-relaxed">
                        {solution.description || 'Specialized software solutions engineered for maximum impact and efficiency.'}
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="bg-slate-50/50 border-t border-slate-50 p-10 mt-auto">
                      <span className="inline-flex items-center text-sm font-bold text-primary uppercase tracking-widest">
                        Learn More <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Not sure which solution is right for you?</h2>
              <p className="text-white/70 text-lg mb-10 leading-relaxed">
                Book a free 30-minute strategy call with our engineering team to discuss your goals and technical requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent text-primary font-bold h-16 px-10 rounded-2xl hover:bg-accent/90 shadow-xl shadow-black/20" asChild>
                  <Link href="/contact">Book Strategy Call</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 h-16 px-10 rounded-2xl" asChild>
                  <Link href="/case-studies">View Success Stories</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
