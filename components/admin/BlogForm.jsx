'use client';

import { useState, useEffect } from 'react';
import { useBlogMutations } from '@/hooks/useBlog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Loader2, Plus, Trash2, X, Bold, Italic, Link as LinkIcon, List, ListOrdered, Heading2, Quote, Underline, Strikethrough, Code, RotateCcw, RotateCw, Highlighter } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExtension from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import LinkExtension from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from './ImageUpload';

export default function BlogForm({ initialData, id }) {
  const router = useRouter();
  const isEdit = id && id !== 'new';
  const { createPost, updatePost, isCreating, isUpdating } = useBlogMutations();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: 'ClickMasters Team',
    published: false,
    thumbnail: '',
    tags: [],
    faqs: [],
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        tags: initialData.tags || [],
        faqs: initialData.faqs || [],
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updatePost({ id, data: formData });
        toast.success('Post updated successfully');
      } else {
        await createPost(formData);
        toast.success('Post created successfully');
      }
      router.push('/admin/blog');
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
      tags: prev.tags.filter(t => t !== tagToRemove)
    }));
  };

  const handleAddFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
  };

  const handleRemoveFaq = (index) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  const handleFaqChange = (index, field, value) => {
    const newFaqs = [...formData.faqs];
    newFaqs[index][field] = value;
    setFormData(prev => ({ ...prev, faqs: newFaqs }));
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExtension,
      Strike,
      LinkExtension.configure({ openOnClick: false, autolink: true }),
      Highlight,
      Placeholder.configure({ placeholder: 'Write your story here…' }),
    ],
    content: initialData?.content || formData.content,
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, content: editor.getHTML() }));
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && initialData) {
      editor.commands.setContent(initialData.content || '');
    }
  }, [editor, initialData]);

  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href || '';
    const url = window.prompt('Enter the URL', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const isLoading = isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between sticky top-20 bg-slate-50/80 backdrop-blur-sm z-30 py-4 border-b border-slate-200 -mx-8 px-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/blog"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <h1 className="text-xl font-bold text-slate-900">
            {isEdit ? `Edit: ${formData.title}` : 'Create New Post'}
          </h1>
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="outline" asChild disabled={isLoading}>
            <Link href="/admin/blog">Cancel</Link>
          </Button>
          <Button type="submit" className="bg-primary text-accent hover:bg-primary/90 min-w-30" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {isEdit ? 'Update Post' : 'Publish Post'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Post Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter a compelling title..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt / Meta Description</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief summary for SEO and lists..."
                  className="h-20"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="content">Content</Label>
                  <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-md">
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor?.chain().focus().toggleBold().run()} title="Bold">
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor?.chain().focus().toggleItalic().run()} title="Italic">
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor?.chain().focus().toggleUnderline().run()} title="Underline">
                      <Underline className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor?.chain().focus().toggleStrike().run()} title="Strikethrough">
                      <Strikethrough className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading">
                      <Heading2 className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor?.chain().focus().toggleBulletList().run()} title="Bullet list">
                      <List className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor?.chain().focus().toggleOrderedList().run()} title="Numbered list">
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor?.chain().focus().toggleBlockquote().run()} title="Quote">
                      <Quote className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor?.chain().focus().toggleCodeBlock().run()} title="Code block">
                      <Code className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={setLink} title="Link">
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor?.chain().focus().toggleHighlight().run()} title="Highlight">
                      <Highlighter className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor?.chain().focus().undo().run()} title="Undo">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor?.chain().focus().redo().run()} title="Redo">
                      <RotateCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white min-h-120 p-4 prose prose-slate max-w-none focus-within:ring-2 focus-within:ring-primary/30">
                  {editor ? (
                    <EditorContent editor={editor} />
                  ) : (
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Write your story here..."
                      className="min-h-120 font-mono text-sm leading-relaxed"
                      required
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQs Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Post FAQs</h3>
              <Button type="button" variant="outline" size="sm" onClick={handleAddFaq}>
                <Plus className="w-4 h-4 mr-2" /> Add FAQ
              </Button>
            </div>

            {formData.faqs.map((faq, index) => (
              <Card key={index} className="border-none shadow-sm relative group">
                <CardContent className="pt-6 space-y-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleRemoveFaq(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400">Question {index + 1}</Label>
                    <Input
                      value={faq.question}
                      onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                      placeholder="What is..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400">Answer</Label>
                    <Textarea
                      value={faq.answer}
                      onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                      placeholder="This is how..."
                      className="h-20"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold">Published Status</Label>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Visibility on frontend</p>
                </div>
                <Switch
                  checked={formData.published}
                  onCheckedChange={(val) => setFormData({ ...formData, published: val })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Custom URL Slug (Optional)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="my-awesome-post"
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
                  placeholder="Press Enter to add tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author Name</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <ImageUpload
                  value={formData.thumbnail}
                  onChange={(url) => setFormData({ ...formData, thumbnail: url })}
                  type="blogs"
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
