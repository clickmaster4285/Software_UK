'use client';

import { useState, useEffect } from 'react';
import { useTestimonialMutations } from '@/hooks/useTestimonials';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Loader2, Star, User } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from './ImageUpload';

export default function TestimonialForm({ initialData, id }) {
  const router = useRouter();
  const isEdit = id && id !== 'new';
  const { createTestimonial, updateTestimonial, isCreating, isUpdating } = useTestimonialMutations();

  const [formData, setFormData] = useState({
    authorName: '',
    authorRole: '',
    authorCompany: '',
    content: '',
    avatarUrl: '',
    rating: 5,
    isActive: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        authorName: initialData.authorName || '',
        authorRole: initialData.authorRole || '',
        authorCompany: initialData.authorCompany || '',
        content: initialData.content || '',
        avatarUrl: initialData.avatarUrl || '',
        rating: initialData.rating || 5,
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateTestimonial({ id, data: formData });
        toast.success('Testimonial updated successfully');
      } else {
        await createTestimonial(formData);
        toast.success('Testimonial added successfully');
      }
      router.push('/admin/testimonials');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between sticky top-20 bg-slate-50/80 backdrop-blur-sm z-30 py-4 border-b border-slate-200 -mx-8 px-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/testimonials"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <h1 className="text-xl font-bold text-slate-900">
            {isEdit ? `Edit Testimonial: ${formData.authorName}` : 'Add New Testimonial'}
          </h1>
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="outline" asChild disabled={isLoading}>
            <Link href="/admin/testimonials">Cancel</Link>
          </Button>
          <Button type="submit" className="bg-primary text-accent hover:bg-primary/90 min-w-30" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {isEdit ? 'Update' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="authorName">Author Name</Label>
                  <Input
                    id="authorName"
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    placeholder="e.g., John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (1-5 Stars)</Label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="transition-transform hover:scale-110"
                      >
                        <Star className={`w-6 h-6 ${formData.rating >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                      </button>
                    ))}
                    <span className="ml-2 text-sm font-bold text-slate-500">{formData.rating} / 5</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="authorRole">Role / Designation</Label>
                  <Input
                    id="authorRole"
                    value={formData.authorRole}
                    onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                    placeholder="e.g., CEO"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="authorCompany">Company</Label>
                  <Input
                    id="authorCompany"
                    value={formData.authorCompany}
                    onChange={(e) => setFormData({ ...formData, authorCompany: e.target.value })}
                    placeholder="e.g., Tech Corp"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Testimonial Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="What did the client say?"
                  className="min-h-38"
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold">Active Status</Label>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Show on website</p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(val) => setFormData({ ...formData, isActive: val })}
                />
              </div>

              <div className="space-y-2">
                <ImageUpload
                  value={formData.avatarUrl}
                  onChange={(url) => setFormData({ ...formData, avatarUrl: url })}
                  type="testimonials"
                  label="Avatar"
                  aspectRatio="square"
                />
                <div className="mt-4 flex flex-col items-center p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <Label className="text-[10px] text-slate-400 uppercase mb-3">Preview</Label>
                  {formData.avatarUrl ? (
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md">
                      <img src={formData.avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-slate-300 shadow-sm">
                      <User className="w-8 h-8" />
                    </div>
                  )}
                  <p className="mt-3 text-xs font-bold text-slate-800">{formData.authorName || 'Name Placeholder'}</p>
                  <p className="text-[10px] text-slate-400">{formData.authorRole || 'Role'} {formData.authorCompany && `@ ${formData.authorCompany}`}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
