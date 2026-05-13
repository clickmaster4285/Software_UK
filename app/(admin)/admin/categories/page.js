'use client';

import { useCategoryList, useCategoryMutations } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Eye, LayoutGrid, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoriesListPage() {
  const { data: categories, isLoading } = useCategoryList();
  const { deleteCategory } = useCategoryMutations();

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        toast.success('Category deleted successfully');
      } catch (err) {
        toast.error('Failed to delete category');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card className="border-none shadow-sm">
          <CardContent className="p-0">
            <div className="space-y-4 p-4">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Categories</h1>
          <p className="text-slate-500 mt-1">Manage service categories and solutions.</p>
        </div>
        <Button asChild className="bg-primary text-accent hover:bg-primary/90">
          <Link href="/admin/categories/new">
            <Plus className="w-4 h-4 mr-2" /> Add Category
          </Link>
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <LayoutGrid className="w-4 h-4" />
            Existing Categories ({categories?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="font-bold text-slate-700">Name</TableHead>
                <TableHead className="font-bold text-slate-700">Slug</TableHead>
                <TableHead className="font-bold text-slate-700">Home Visibility</TableHead>
                <TableHead className="font-bold text-slate-700 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories?.map((category) => (
                <TableRow key={category._id} className="group border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <div className="font-bold text-slate-900">{category.name}</div>
                    <div className="text-xs text-slate-400 line-clamp-1 max-w-[300px]">{category.description || 'No description'}</div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">/solutions/{category.slug}</code>
                  </TableCell>
                  <TableCell>
                    {category.showOnHome ? (
                      <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-50">Visible</Badge>
                    ) : (
                      <Badge variant="outline" className="text-slate-400 border-slate-200">Hidden</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" asChild title="View Public Page">
                        <Link href={`/solutions/${category.slug || category._id}`} target="_blank">
                          <Eye className="w-4 h-4 text-slate-400 hover:text-primary" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild title="Edit Category">
                        <Link href={`/admin/categories/${category._id}`}>
                          <Pencil className="w-4 h-4 text-slate-400 hover:text-primary" />
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(category._id)}
                        title="Delete Category"
                        className="hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {categories?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-slate-500">
                    No categories found. Create your first one to get started!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
