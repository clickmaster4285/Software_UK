'use client';

import { useCategory } from '@/hooks/useCategories';
import CategoryForm from '@/components/admin/CategoryForm';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function EditCategoryPage() {
  const { id } = useParams();
  const { data: category, isLoading } = useCategory(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <CategoryForm initialData={category} id={id} />
    </div>
  );
}
