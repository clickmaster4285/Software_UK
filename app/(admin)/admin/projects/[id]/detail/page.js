'use client';

import { useProject } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, ExternalLink, Globe, Tag, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';
import { Label } from '@/components/ui/label';

export default function ProjectDetailPage({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const { data: project, isLoading } = useProject(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800">Project not found</h2>
        <Button asChild variant="link" className="mt-4">
          <Link href="/admin/projects">Back to Projects</Link>
        </Button>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'coming-soon': return 'bg-purple-100 text-purple-700';
      case 'maintenance': return 'bg-orange-100 text-orange-700';
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/projects"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <h1 className="text-2xl font-bold text-slate-900">Project Details</h1>
        </div>
        <Button asChild className="bg-primary text-accent hover:bg-primary/90">
          <Link href={`/admin/projects/${id}`}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Project
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <div className="aspect-video bg-slate-100 relative">
              {project.thumbnail ? (
                <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 italic">No thumbnail provided</div>
              )}
              <div className="absolute top-4 right-4">
                <Badge className={getStatusColor(project.status)}>
                  {project.status?.toUpperCase().replace('-', ' ')}
                </Badge>
              </div>
            </div>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">{project.title}</h2>
                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-4 h-4" />
                    {project.category?.name || 'Uncategorized'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    Created {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                  {project.createdBy && (
                    <span className="flex items-center gap-1.5">
                      <User className="w-4 h-4" />
                      By {project.createdBy.name || 'Admin'}
                    </span>
                  )}
                </div>
              </div>

              <div className="prose prose-slate max-w-none">
                <h3 className="text-lg font-bold text-slate-800 mb-3">Project Description</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{project.description}</p>
              </div>

              {project.tags?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Technologies & Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-slate-600 border-slate-200">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Project Assets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                <Label className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Live Preview</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate max-w-38">{project.url}</span>
                  <Button variant="outline" size="sm" asChild className="h-8 px-2">
                    <a href={project.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                      Visit
                    </a>
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                <Label className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Quick Metadata</Label>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">ID:</span>
                    <span className="font-mono text-[10px]">{project._id}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Status:</span>
                    <span className="capitalize">{project.status}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Last Update:</span>
                    <span>{new Date(project.updatedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
