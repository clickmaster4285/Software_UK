'use client';

import { useState, useEffect } from 'react';
import { useProjectMutations } from '@/hooks/useProjects';
import { useCategoryList } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Loader2, Plus, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import ImageUpload from './ImageUpload';

export default function ProjectForm({ initialData, id }) {
  const router = useRouter();
  const isEdit = id && id !== 'new';
  const { createProject, updateProject, isCreating, isUpdating } = useProjectMutations();
  const { data: categories } = useCategoryList();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    category: '',
    tags: [],
    status: 'live',
    thumbnail: '',
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        url: initialData.url || '',
        category: initialData.category?._id || initialData.category || '',
        tags: initialData.tags || [],
        status: initialData.status || 'live',
        thumbnail: initialData.thumbnail || '',
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }
    try {
      if (isEdit) {
        await updateProject({ id, data: formData });
        toast.success('Project updated successfully');
      } else {
        await createProject(formData);
        toast.success('Project created successfully');
      }
      router.push('/admin/projects');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const isLoading = isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between sticky top-20 bg-slate-50/80 backdrop-blur-sm z-30 py-4 border-b border-slate-200 -mx-8 px-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/projects"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <h1 className="text-xl font-bold text-slate-900">
            {isEdit ? `Edit: ${formData.title}` : 'Add New Project'}
          </h1>
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="outline" asChild disabled={isLoading}>
            <Link href="/admin/projects">Cancel</Link>
          </Button>
          <Button type="submit" className="bg-primary text-accent hover:bg-primary/90 min-w-30" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {isEdit ? 'Update Project' : 'Save Project'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., E-commerce Redesign"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">Project URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed project description..."
                  className="min-h-50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-slate-100 text-slate-700 gap-1 pr-1">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input
                  placeholder="Press Enter to add tags..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => setFormData({ ...formData, category: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map(cat => (
                      <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) => setFormData({ ...formData, status: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="coming-soon">Coming Soon</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <ImageUpload
                  value={formData.thumbnail}
                  onChange={(url) => setFormData({ ...formData, thumbnail: url })}
                  type="projects"
                  label="Thumbnail"
                  aspectRatio="video"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
