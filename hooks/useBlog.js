'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogApi } from '@/features/blogApi';

export function useBlogList(drafts = false) {
  return useQuery({
    queryKey: ['blogs', { drafts }],
    queryFn: () => blogApi.getAll(drafts),
  });
}

export function useBlogPost(id, drafts = false) {
  return useQuery({
    queryKey: ['blog', id, { drafts }],
    queryFn: () => blogApi.getById(id, drafts),
    enabled: !!id && id !== 'new',
  });
}

export function useBlogMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data) => blogApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => blogApi.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog', variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => blogApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });

  return {
    createPost: createMutation.mutateAsync,
    updatePost: updateMutation.mutateAsync,
    deletePost: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
