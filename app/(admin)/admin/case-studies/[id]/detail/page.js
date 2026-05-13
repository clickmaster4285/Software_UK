'use client';

import { useCaseStudy } from '@/hooks/useCaseStudies';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Edit, Calendar, User, Layout, CheckCircle2, Target, Lightbulb, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CaseStudyDetailPage() {
  const { id } = useParams();
  const { data: study, isLoading } = useCaseStudy(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!study) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900">Case Study not found</h2>
        <Link href="/admin/case-studies" className="text-primary hover:underline mt-4 inline-block">Back to list</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/case-studies"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Case Study Preview</h1>
            <p className="text-sm text-slate-500">Preview how this case study looks internally.</p>
          </div>
        </div>
        <Button asChild className="bg-primary text-accent hover:bg-primary/90">
          <Link href={`/admin/case-studies/${id}`}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Case Study
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Header Card */}
          <Card className="border-none shadow-sm overflow-hidden">
            <div className="aspect-video relative bg-slate-100">
              <img
                src={study.thumbnail || study.project?.thumbnail || 'https://via.placeholder.com/1200x675?text=No+Image'}
                alt={study.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge variant={study.published ? 'success' : 'secondary'} className={study.published ? 'bg-green-500 text-white border-none' : ''}>
                  {study.published ? 'Published' : 'Draft'}
                </Badge>
              </div>
            </div>
            <CardHeader className="pt-8">
              <h1 className="text-3xl font-bold text-slate-900 leading-tight">{study.title}</h1>
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-500">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span>Client: {study.client || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(study.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Layout className="w-4 h-4" />
                  <span>Project: {study.project?.title || 'N/A'}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-8">
              <p className="text-lg text-slate-600 italic border-l-4 border-accent pl-4 py-1 bg-slate-50 rounded-r-lg">
                {study.excerpt}
              </p>
            </CardContent>
          </Card>

          {/* Detailed Content */}
          <div className="space-y-6">
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Target className="w-5 h-5" />
                <h2 className="text-xl font-bold">The Challenge</h2>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-slate-700 leading-relaxed whitespace-pre-wrap">
                {study.challenge}
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Lightbulb className="w-5 h-5" />
                <h2 className="text-xl font-bold">Our Approach</h2>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-slate-700 leading-relaxed whitespace-pre-wrap">
                {study.approach}
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="w-5 h-5" />
                <h2 className="text-xl font-bold">The Results</h2>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-slate-700 leading-relaxed whitespace-pre-wrap">
                {study.results}
              </div>
            </section>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Project Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs text-slate-400 uppercase tracking-wider">Status</Label>
                <div className="mt-1 font-semibold capitalize text-slate-700">{study.status}</div>
              </div>
              <div>
                <Label className="text-xs text-slate-400 uppercase tracking-wider">Linked Project</Label>
                <div className="mt-1">
                  <Link href={`/admin/projects/${study.project?._id || study.project?.id || ''}`} className="text-primary hover:underline font-medium">
                    {study.project?.title || 'View Project'}
                  </Link>
                </div>
              </div>
              <div>
                <Label className="text-xs text-slate-400 uppercase tracking-wider">Technologies</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {study.technologies?.map(tech => (
                    <Badge key={tech} variant="outline" className="bg-slate-50">
                      {tech}
                    </Badge>
                  ))}
                  {(!study.technologies || study.technologies.length === 0) && (
                    <span className="text-slate-400 text-sm italic">No technologies listed</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-primary text-white">
            <CardContent className="pt-6">
              <h3 className="font-bold mb-2">Public Preview</h3>
              <p className="text-sm text-white/70 mb-4">
                This case study is currently <strong>{study.published ? 'Published' : 'a Draft'}</strong>.
                {study.published ? ' It is visible to all visitors.' : ' It is only visible in the admin panel.'}
              </p>
              <Button variant="secondary" className="w-full bg-accent text-primary hover:bg-accent/90" asChild>
                <Link href={`/case-studies/${study.slug || study._id}`} target="_blank">
                  View Public Page
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
