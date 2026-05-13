'use client';

import { useTestimonial } from '@/hooks/useTestimonials';
import TestimonialForm from '@/components/admin/TestimonialForm';
import { use } from 'react';

export default function TestimonialEditPage({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const { data: testimonial, isLoading } = useTestimonial(id);

  if (id !== 'new' && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <TestimonialForm initialData={testimonial} id={id} />;
}
