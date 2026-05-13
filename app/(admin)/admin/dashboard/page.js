'use client';

import { useBlogList } from '@/hooks/useBlog';
import { useProjectList } from '@/hooks/useProjects';
import { useCaseStudyList } from '@/hooks/useCaseStudies';
import { useTestimonialList } from '@/hooks/useTestimonials';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Briefcase, BookOpen, MessageSquare, TrendingUp, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const { data: blogs, isLoading: loadingBlogs } = useBlogList(true);
  const { data: projects, isLoading: loadingProjects } = useProjectList();
  const { data: caseStudies, isLoading: loadingCaseStudies } = useCaseStudyList(true);
  const { data: testimonials, isLoading: loadingTestimonials } = useTestimonialList();

  const stats = [
    { label: 'Blog Posts', value: blogs?.length || 0, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', loading: loadingBlogs, href: '/admin/blog' },
    { label: 'Projects', value: projects?.length || 0, icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-50', loading: loadingProjects, href: '/admin/projects' },
    { label: 'Case Studies', value: caseStudies?.length || 0, icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-50', loading: loadingCaseStudies, href: '/admin/case-studies' },
    { label: 'Testimonials', value: testimonials?.length || 0, icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50', loading: loadingTestimonials, href: '/admin/testimonials' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Real-time statistics and quick management tools.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">System Status</p>
            <p className="text-sm font-bold text-emerald-500 flex items-center justify-end gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Operational
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer active:scale-[0.98]">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-tight">{stat.label}</CardTitle>
                <div className={`${stat.bg} ${stat.color} p-2.5 rounded-xl transition-colors group-hover:scale-110`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                {stat.loading ? (
                  <Skeleton className="h-9 w-20" />
                ) : (
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</div>
                    <div className="text-xs font-medium text-slate-400">total</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { label: 'New Blog Post', desc: 'Write & publish news', icon: FileText, color: 'text-blue-600', href: '/admin/blog/new' },
              { label: 'New Project', desc: 'Add work to portfolio', icon: Briefcase, color: 'text-emerald-600', href: '/admin/projects/new' },
              { label: 'New Case Study', desc: 'Create success story', icon: BookOpen, color: 'text-amber-600', href: '/admin/case-studies/new' },
              { label: 'New Testimonial', desc: 'Add client feedback', icon: MessageSquare, color: 'text-purple-600', href: '/admin/testimonials/new' },
            ].map((action) => (
              <Button 
                key={action.label}
                variant="outline" 
                className="h-auto p-4 justify-start text-left border-slate-200 hover:border-primary/50 hover:bg-slate-50 group"
                asChild
              >
                <Link href={action.href}>
                  <div className={`${action.color} bg-white p-2 rounded-lg border border-slate-100 shadow-sm mr-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{action.label}</div>
                    <div className="text-[11px] text-slate-500">{action.desc}</div>
                  </div>
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-bold text-slate-800">Recent Content</h3>
          <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="p-8 text-center bg-slate-50/50">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-900">Activity Analytics</h4>
                <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
                  Detailed analytics and activity logging are being integrated. Check back soon for deeper insights.
                </p>
                <Button variant="outline" className="mt-6 text-xs uppercase tracking-widest font-bold h-9" disabled>
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
