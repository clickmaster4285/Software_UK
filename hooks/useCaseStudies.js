'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { caseStudyApi } from '@/features/caseStudyApi';

export function useCaseStudyList(drafts = false) {
  return useQuery({
    queryKey: ['case-studies', { drafts }],
    queryFn: () => caseStudyApi.getAll(drafts),
  });
}

export function useCaseStudy(id, drafts = false) {
  return useQuery({
    queryKey: ['case-study', id, { drafts }],
    queryFn: () => caseStudyApi.getById(id, drafts),
    enabled: !!id && id !== 'new',
  });
}

export function useCaseStudyMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data) => caseStudyApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['case-studies'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => caseStudyApi.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['case-studies'] });
      queryClient.invalidateQueries({ queryKey: ['case-study', variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => caseStudyApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['case-studies'] });
    },
  });

  return {
    createCaseStudy: createMutation.mutateAsync,
    updateCaseStudy: updateMutation.mutateAsync,
    deleteCaseStudy: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
