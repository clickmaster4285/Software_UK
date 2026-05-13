'use client';

import { useCaseStudyList, useCaseStudyMutations } from '@/hooks/useCaseStudies';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CaseStudyListPage() {
  const { data: caseStudies, isLoading } = useCaseStudyList(true);
  const { deleteCaseStudy } = useCaseStudyMutations();

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this case study?')) return;
    try {
      await deleteCaseStudy(id);
      toast.success('Case study deleted successfully');
    } catch (err) {
      toast.error('Failed to delete case study');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Case Studies</h1>
          <p className="text-sm text-slate-500">Showcase your best work and success stories.</p>
        </div>
        <Button asChild className="bg-primary text-accent hover:bg-primary/90">
          <Link href="/admin/case-studies/new">
            <Plus className="w-4 h-4 mr-2" />
            New Case Study
          </Link>
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg">All Case Studies ({caseStudies?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Project</TableHead>
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
              ) : caseStudies?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-slate-400">
                    No case studies found. Create your first one!
                  </TableCell>
                </TableRow>
              ) : (
                caseStudies?.map((study) => (
                  <TableRow key={study._id} className="group">
                    <TableCell className="font-medium max-w-xs truncate">
                      {study.title}
                    </TableCell>
                    <TableCell className="text-slate-500">{study.project?.title || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={study.published ? 'success' : 'secondary'} className={study.published ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}>
                        {study.published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 text-xs">
                      {new Date(study.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild title="View Details">
                          <Link href={`/admin/case-studies/${study._id}/detail`}>
                            <Eye className="w-4 h-4 text-slate-400 group-hover:text-primary" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild title="Edit">
                          <Link href={`/admin/case-studies/${study._id}`}>
                            <Edit className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(study._id)}
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
