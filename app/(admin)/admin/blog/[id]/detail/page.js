'use client';

import { use } from 'react';
import { useBlogPost } from '@/hooks/useBlog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, ExternalLink, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogDetailPage({ params }) {
  const { id } = use(params);
  const { data: post, isLoading } = useBlogPost(id, true);

  if (isLoading) return <div className="animate-pulse space-y-4">...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/admin/blog"><ArrowLeft className="w-4 h-4 mr-2" /> Back to List</Link>
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href={`/blog/${post.slug}`} target="_blank">
              <ExternalLink className="w-4 h-4 mr-2" /> View on Site
            </Link>
          </Button>
          <Button asChild className="bg-primary text-accent hover:bg-primary/90">
            <Link href={`/admin/blog/${id}`}>
              <Edit className="w-4 h-4 mr-2" /> Edit Post
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Badge variant={post.published ? 'success' : 'secondary'} className={post.published ? 'bg-green-100 text-green-700' : ''}>
            {post.published ? 'Published' : 'Draft'}
          </Badge>
          <h1 className="text-4xl font-bold text-slate-900 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-6 text-sm text-slate-500 pt-2">
            <div className="flex items-center gap-2"><User className="w-4 h-4" /> {post.author}</div>
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
          </div>
        </div>

        {post.thumbnail && (
          <div className="relative rounded-2xl overflow-hidden aspect-video border border-slate-200">
            <Image src={post.thumbnail} alt={post.title} fill sizes="(max-width: 1024px) 100vw, 896px" className="object-cover" />
          </div>
        )}

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-500 text-sm uppercase tracking-widest font-bold">Excerpt</CardTitle>
          </CardHeader>
          <CardContent className="text-lg text-slate-700 leading-relaxed italic">
            "{post.excerpt}"
          </CardContent>
        </Card>

        <div className="prose prose-slate max-w-none prose-headings:font-sora prose-p:text-slate-600 prose-p:leading-8">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {post.faqs?.length > 0 && (
          <div className="pt-10 space-y-6">
            <h3 className="text-2xl font-bold text-slate-900 font-sora">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {post.faqs.map((faq, i) => (
                <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <div className="font-bold text-slate-900">{faq.question}</div>
                  <div className="text-slate-600 leading-relaxed">{faq.answer}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
