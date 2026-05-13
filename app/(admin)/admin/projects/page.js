'use client';

import { useProjectList, useProjectMutations } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Eye, ExternalLink, Globe } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ProjectListPage() {
  const { data: projects, isLoading } = useProjectList();
  const { deleteProject } = useProjectMutations();

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteProject(id);
      toast.success('Project deleted successfully');
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-sm text-slate-500">Showcase your agency's best work.</p>
        </div>
        <Button asChild className="bg-primary text-accent hover:bg-primary/90">
          <Link href="/admin/projects/new">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Link>
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg">All Projects ({projects?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5} className="h-12 animate-pulse bg-slate-50" />
                  </TableRow>
                ))
              ) : projects?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-slate-400">
                    No projects found. Add your first showcase project!
                  </TableCell>
                </TableRow>
              ) : (
                projects?.map((project) => (
                  <TableRow key={project._id} className="group">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        {project.thumbnail && (
                          <div className="w-10 h-10 rounded overflow-hidden border border-slate-100 shrink-0">
                            <img src={project.thumbnail} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="truncate max-w-50">{project.title}</span>
                          {project.url && (
                            <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary flex items-center gap-0.5 hover:underline">
                              <Globe className="w-2.5 h-2.5" />
                              Visit Site
                            </a>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {project.category?.name || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusColor(project.status)}>
                        {project.status?.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 text-xs">
                      {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild title="View Details">
                          <Link href={`/admin/projects/${project._id}/detail`}>
                            <Eye className="w-4 h-4 text-slate-400 group-hover:text-primary" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild title="Edit">
                          <Link href={`/admin/projects/${project._id}`}>
                            <Edit className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(project._id)}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
