'use client';

import { useBlogList } from '@/hooks/useBlog';
import { Skeleton } from '@/components/ui/skeleton';
import { BlogCard } from '@/components/admin/blog-card';

export default function BlogPage() {
  const { data: blogs, isLoading } = useBlogList();
  const publishedBlogs = blogs?.filter(post => post.published) || [];

  return (
    <main className="bg-white">
      <section className="page-hero">
        <div className="container">
          <span className="section-label">RESOURCES</span>
          <h1>Insights & Strategies</h1>
          <p className="hero-sub text-white/90 max-w-2xl mx-auto">
            Expert tips and insights on software engineering, cloud architecture, and digital transformation.
          </p>
        </div>
      </section>

      <section className="py-24 bg-surface">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-64 w-full rounded-2xl" />
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ))}
            </div>
          ) : publishedBlogs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900">Our blog is coming soon</h3>
              <p className="text-slate-500 mt-2">We're currently writing some amazing content for you. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publishedBlogs.map((post, index) => (
                <div
                  key={post._id}
                  className="opacity-0 animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
                >
                  <BlogCard
                    title={post.title}
                    excerpt={post.excerpt}
                    category={post.category || 'Article'}
                    image={post.image || 'https://via.placeholder.com/800x450?text=Insights'}
                    createdAt={post.createdAt}
                    readTime={post.readTime || `${post.readTimeMinutes || 5} min`}
                    href={`/blog/${post.slug || post._id}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
