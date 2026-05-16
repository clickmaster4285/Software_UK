'use client';

import { useState, useEffect } from 'react';
import { useCaseStudyMutations } from '@/hooks/useCaseStudies';
import { useProjectList } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import ImageUpload from './ImageUpload';

export default function CaseStudyForm({ initialData, id }) {
  const router = useRouter();
  const isEdit = id && id !== 'new';
  const { createCaseStudy, updateCaseStudy, isCreating, isUpdating } = useCaseStudyMutations();
  const { data: projects } = useProjectList();

  const [formData, setFormData] = useState({
    project: '',
    title: '',
    slug: '',
    excerpt: '',
    client: '',
    technologies: [],
    thumbnail: '',
    status: 'completed',
    challenge: '',
    approach: '',
    results: '',
    published: false,
  });

  const [techInput, setTechInput] = useState('');

  useEffect(() => {
    if (initialData) {
      const timer = setTimeout(() => {
        setFormData({
          project: initialData.project?._id || initialData.project || '',
          title: initialData.title || '',
          slug: initialData.slug || '',
          excerpt: initialData.excerpt || '',
          client: initialData.client || '',
          technologies: initialData.technologies || [],
          thumbnail: initialData.thumbnail || '',
          status: initialData.status || 'completed',
          challenge: initialData.challenge || '',
          approach: initialData.approach || '',
          results: initialData.results || '',
          published: initialData.published || false,
        });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.project) {
      toast.error('Please select a project');
      return;
    }
    try {
      if (isEdit) {
        await updateCaseStudy({ id, data: formData });
        toast.success('Case study updated successfully');
      } else {
        await createCaseStudy(formData);
        toast.success('Case study created successfully');
      }
      router.push('/admin/case-studies');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleAddTech = (e) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      if (!formData.technologies.includes(techInput.trim())) {
        setFormData(prev => ({
          ...prev,
          technologies: [...prev.technologies, techInput.trim()]
        }));
      }
      setTechInput('');
    }
  };

  const removeTech = (techToRemove) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== techToRemove)
    }));
  };

  const isLoading = isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between sticky top-20 bg-slate-50/80 backdrop-blur-sm z-30 py-4 border-b border-slate-200 -mx-8 px-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/case-studies"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <h1 className="text-xl font-bold text-slate-900">
            {isEdit ? `Edit: ${formData.title}` : 'Add New Case Study'}
          </h1>
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="outline" asChild disabled={isLoading}>
            <Link href="/admin/case-studies">Cancel</Link>
          </Button>
          <Button type="submit" className="bg-primary text-accent hover:bg-primary/90 min-w-30" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {isEdit ? 'Update Case Study' : 'Save Case Study'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Case Study Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Transforming Digital Presence for TechCorp"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL Path)</Label>
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">
                    /case-studies/
                  </span>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="transforming-digital-presence"
                    className="rounded-l-none"
                  />
                </div>
                <p className="text-[10px] text-slate-500 italic">Leave empty to auto-generate from title.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt / Summary</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief summary for listings..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="challenge">The Challenge</Label>
                <Textarea
                  id="challenge"
                  value={formData.challenge}
                  onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                  placeholder="What was the problem?"
                  className="min-h-32"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="approach">Our Approach</Label>
                <Textarea
                  id="approach"
                  value={formData.approach}
                  onChange={(e) => setFormData({ ...formData, approach: e.target.value })}
                  placeholder="How did we solve it?"
                  className="min-h-32"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="results">The Results</Label>
                <Textarea
                  id="results"
                  value={formData.results}
                  onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                  placeholder="What was the outcome?"
                  className="min-h-32"
                  required
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
                  <Label>Published Status</Label>
                  <p className="text-[10px] text-slate-500">Visible on the public website</p>
                </div>
                <Switch
                  checked={formData.published}
                  onCheckedChange={(val) => setFormData({ ...formData, published: val })}
                />
              </div>

              <div className="space-y-2">
                <Label>Linked Project</Label>
                <Select
                  value={formData.project}
                  onValueChange={(val) => setFormData({ ...formData, project: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects?.map(proj => (
                      <SelectItem key={proj._id} value={proj._id}>{proj.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client">Client Name</Label>
                <Input
                  id="client"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  placeholder="e.g., TechCorp Solutions"
                />
              </div>

              <div className="space-y-2">
                <Label>Technologies Used</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.technologies.map(tech => (
                    <Badge key={tech} variant="secondary" className="bg-slate-100 text-slate-700 gap-1 pr-1">
                      {tech}
                      <button type="button" onClick={() => removeTech(tech)} className="hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input
                  placeholder="Press Enter to add tech..."
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={handleAddTech}
                />
              </div>

              <div className="space-y-2">
                <Label>Project Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) => setFormData({ ...formData, status: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <ImageUpload
                  value={formData.thumbnail}
                  onChange={(url) => setFormData({ ...formData, thumbnail: url })}
                  type="case-studies"
                  label="Custom Thumbnail"
                  aspectRatio="video"
                />
                <p className="text-[10px] text-slate-500 italic">Leave empty to use project thumbnail.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
