'use client';

import { useState, useEffect } from 'react';
import { useCategoryMutations } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CategoryForm({ initialData, id }) {
  const router = useRouter();
  const isEdit = id && id !== 'new';
  const { createCategory, updateCategory, isCreating, isUpdating } = useCategoryMutations();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    showOnHome: false,
  });

  useEffect(() => {
    if (initialData) {
      const timer = setTimeout(() => {
        setFormData({
          name: initialData.name || '',
          slug: initialData.slug || '',
          description: initialData.description || '',
          showOnHome: initialData.showOnHome || false,
        });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateCategory({ id, data: formData });
        toast.success('Category updated successfully');
      } else {
        await createCategory(formData);
        toast.success('Category created successfully');
      }
      router.push('/admin/categories');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between sticky top-20 bg-slate-50/80 backdrop-blur-sm z-30 py-4 border-b border-slate-200 -mx-8 px-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/categories"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <h1 className="text-xl font-bold text-slate-900">
            {isEdit ? `Edit: ${formData.name}` : 'Add New Category'}
          </h1>
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="outline" asChild disabled={isLoading}>
            <Link href="/admin/categories">Cancel</Link>
          </Button>
          <Button type="submit" className="bg-primary text-accent hover:bg-primary/90 min-w-30" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {isEdit ? 'Update Category' : 'Save Category'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Software Development"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL Path)</Label>
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">
                    /solutions/
                  </span>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="software-development"
                    className="rounded-l-none"
                  />
                </div>
                <p className="text-[10px] text-slate-500 italic">Leave empty to auto-generate from name.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What does this category cover?"
                  className="min-h-32"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="space-y-0.5">
                  <Label>Show on Home</Label>
                  <p className="text-[10px] text-slate-500">Feature this in the homepage services section</p>
                </div>
                <Switch 
                  checked={formData.showOnHome} 
                  onCheckedChange={(val) => setFormData({ ...formData, showOnHome: val })} 
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
