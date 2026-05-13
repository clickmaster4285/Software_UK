'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { testimonialApi } from '@/features/testimonialApi';

export function useTestimonialList() {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: () => testimonialApi.getAll(),
  });
}

export function useTestimonial(id) {
  return useQuery({
    queryKey: ['testimonial', id],
    queryFn: () => testimonialApi.getById(id),
    enabled: !!id && id !== 'new',
  });
}

export function useTestimonialMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data) => testimonialApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => testimonialApi.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonial', variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => testimonialApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });

  return {
    createTestimonial: createMutation.mutateAsync,
    updateTestimonial: updateMutation.mutateAsync,
    deleteTestimonial: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
