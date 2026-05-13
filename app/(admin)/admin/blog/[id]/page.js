'use client';

import { use } from 'react';
import { useBlogPost } from '@/hooks/useBlog';
import BlogForm from '@/components/admin/BlogForm';
import { Loader2 } from 'lucide-react';

export default function EditBlogPage({ params }) {
  const { id } = use(params);
  const isEdit = id !== 'new';
  const { data: post, isLoading } = useBlogPost(id, true);

  if (isEdit && isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return <BlogForm initialData={post} id={id} />;
}
