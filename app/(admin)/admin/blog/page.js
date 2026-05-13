'use client';

import { useBlogList, useBlogMutations } from '@/hooks/useBlog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Eye, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function BlogListPage() {
  const { data: blogs, isLoading } = useBlogList(true);
  const { deletePost } = useBlogMutations();

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(id);
      toast.success('Post deleted successfully');
    } catch (err) {
      toast.error('Failed to delete post');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Blog Posts</h1>
          <p className="text-sm text-slate-500">Manage your agency insights and news.</p>
        </div>
        <Button asChild className="bg-primary text-accent hover:bg-primary/90">
          <Link href="/admin/blog/new">
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Link>
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg">All Posts ({blogs?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
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
              ) : blogs?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-slate-400">
                    No blog posts found. Create your first one!
                  </TableCell>
                </TableRow>
              ) : (
                blogs?.map((post) => (
                  <TableRow key={post._id} className="group">
                    <TableCell className="font-medium max-w-xs truncate">
                      {post.title}
                    </TableCell>
                    <TableCell className="text-slate-500">{post.author || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={post.published ? 'success' : 'secondary'} className={post.published ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}>
                        {post.published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 text-xs">
                      {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild title="View Details">
                          <Link href={`/admin/blog/${post._id}/detail`}>
                            <Eye className="w-4 h-4 text-slate-400 group-hover:text-primary" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild title="Edit">
                          <Link href={`/admin/blog/${post._id}`}>
                            <Edit className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(post._id)}
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
