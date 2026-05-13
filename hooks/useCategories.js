'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from '@/features/categoryApi';

export function useCategoryList() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAll(),
  });
}

export function useCategory(id) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => categoryApi.getById(id),
    enabled: !!id && id !== 'new',
  });
}

export function useCategoryMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data) => categoryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => categoryApi.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category', variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => categoryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  return {
    createCategory: createMutation.mutateAsync,
    updateCategory: updateMutation.mutateAsync,
    deleteCategory: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
