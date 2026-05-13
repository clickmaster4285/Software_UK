'use client';

import { useParams } from 'next/navigation';
import { useBlogPost } from '@/hooks/useBlog';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Clock, ChevronRight, Share2, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function BlogPostDetailPage() {
  const { id } = useParams();
  const { data: post, isLoading, error } = useBlogPost(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-24">
        <div className="container max-w-4xl">
          <Skeleton className="h-10 w-48 mb-8" />
          <Skeleton className="h-20 w-full mb-12" />
          <Skeleton className="h-100 w-full rounded-3xl mb-12" />
          <div className="space-y-6">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return notFound();
  }

  return (
    <main className="bg-linear-to-b from-white to-slate-50 min-h-screen pt-32 pb-24">
      <article className="container max-w-4xl">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-12 opacity-0 animate-fade-down" style={{ animationFillMode: 'forwards' }}>
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-medium truncate">{post.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-16 opacity-0 animate-fade-up" style={{ animationFillMode: 'forwards' }}>
          <div className="flex items-center gap-4 mb-8">
            <Badge className="bg-accent text-primary hover:bg-accent/90 px-4 py-2 text-sm font-bold">
              {post.category || 'Insights'}
            </Badge>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary mb-8 leading-[1.1] tracking-tight">
            {post.title}
          </h1>

          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-primary-mid overflow-hidden border-2 border-white shadow-lg">
                    {post.authorImage ? (
                      <img src={post.authorImage} alt={post.author} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-accent font-bold">
                        {(post.author || 'Engineering Team').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Author</div>
                  <div className="text-lg font-bold text-slate-900">{post.author || 'Engineering Team'}</div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Published</div>
                    <div className="text-sm font-bold text-slate-900">
                      {new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Reading Time</div>
                    <div className="text-sm font-bold text-slate-900">{post.readTimeMinutes || post.readTime || '5'} min</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {post.authorLinkedin && (
                  <Button variant="outline" size="icon" className="rounded-xl border-slate-200 hover:bg-primary hover:text-accent hover:border-primary transition-all" asChild>
                    <a href={post.authorLinkedin} target="_blank" rel="noopener noreferrer">
                      <LinkIcon className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                <Button variant="outline" size="icon" className="rounded-xl border-slate-200 hover:bg-primary hover:text-accent hover:border-primary transition-all">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 mb-16 aspect-video opacity-0 animate-fade-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <img
            src={post.image || post.thumbnail || 'https://via.placeholder.com/1200x600?text=Insights'}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent"></div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-lg mb-16 opacity-0 animate-fade-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          <div
            className="prose prose-slate prose-lg max-w-none text-slate-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="bg-slate-50 rounded-2xl p-8 mb-16 opacity-0 animate-fade-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            <h3 className="text-lg font-bold text-slate-900 mb-6">Topics Covered</h3>
            <div className="flex flex-wrap gap-3">
              {post.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="bg-white text-slate-600 hover:bg-primary hover:text-accent border border-slate-200 px-4 py-2 text-sm font-medium transition-all">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* FAQs Section */}
        {post.faqs?.length > 0 && (
          <section className="bg-linear-to-br from-primary to-primary-mid rounded-3xl p-8 md:p-16 text-white mb-16 opacity-0 animate-fade-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-12">{post.faqHeading || 'Frequently Asked Questions'}</h2>
            <Accordion type="single" collapsible className="w-full">
              {post.faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-white/20 bg-white/5 rounded-xl overflow-hidden mb-4">
                  <AccordionTrigger className="text-left font-bold text-white hover:text-accent transition-colors px-6 py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80 leading-relaxed px-6 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}

        {/* Newsletter / CTA */}
        <div className="bg-primary text-white p-12 md:p-20 rounded-[4rem] text-center relative overflow-hidden opacity-0 animate-fade-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">Stay ahead of the curve</h3>
            <p className="text-white/70 mb-10 max-w-md mx-auto">
              Get our latest technical insights and industry strategies delivered directly to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <Button className="bg-accent text-primary font-bold px-8 h-14 rounded-2xl hover:bg-accent/90">
                Subscribe
              </Button>
            </div>
            <p className="text-[10px] text-white/40 mt-6">
              No spam. Just technical excellence. Unsubscribe at any time.
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-20 text-center">
          <Button variant="ghost" asChild className="text-slate-500 hover:text-primary">
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to all articles
            </Link>
          </Button>
        </div>
      </article>
    </main>
  );
}
