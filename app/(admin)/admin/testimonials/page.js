'use client';

import { useTestimonialList, useTestimonialMutations } from '@/hooks/useTestimonials';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Star, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';

export default function TestimonialListPage() {
  const { data: testimonials, isLoading } = useTestimonialList();
  const { deleteTestimonial } = useTestimonialMutations();

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await deleteTestimonial(id);
      toast.success('Testimonial deleted successfully');
    } catch (err) {
      toast.error('Failed to delete testimonial');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Testimonials</h1>
          <p className="text-sm text-slate-500">Manage client feedback and social proof.</p>
        </div>
        <Button asChild className="bg-primary text-accent hover:bg-primary/90">
          <Link href="/admin/testimonials/new">
            <Plus className="w-4 h-4 mr-2" />
            New Testimonial
          </Link>
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg">All Testimonials ({testimonials?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Author</TableHead>
                <TableHead>Rating</TableHead>
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
              ) : testimonials?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-slate-400">
                    No testimonials found. Add your first client review!
                  </TableCell>
                </TableRow>
              ) : (
                testimonials?.map((t) => (
                  <TableRow key={t._id} className="group">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        {t.avatarUrl ? (
                          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-100 shrink-0">
                            <Image src={t.avatarUrl} alt="" fill sizes="36px" className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                            <User className="w-4 h-4" />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="truncate max-w-[180px]">{t.authorName}</span>
                          <span className="text-[10px] text-slate-400 truncate max-w-[180px]">
                            {t.authorRole}{t.authorCompany ? ` @ ${t.authorCompany}` : ''}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-bold text-slate-700">{t.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={t.isActive ? 'success' : 'secondary'} className={t.isActive ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}>
                        {t.isActive ? 'Active' : 'Hidden'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 text-xs">
                      {formatDate(t.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild title="Edit">
                          <Link href={`/admin/testimonials/${t._id}`}>
                            <Edit className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(t._id)}
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
