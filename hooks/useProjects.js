'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectApi } from '@/features/projectApi';
import { useCategoryList } from './useCategories';
import { getCategoryName } from '@/lib/utils';

export function useProjectList() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => projectApi.getAll(),
  });
}

export function useGroupedProjects() {
  const { data: projects = [], isLoading: projectsLoading } = useProjectList();
  const { data: categories = [], isLoading: categoriesLoading } = useCategoryList();

  const isLoading = projectsLoading || categoriesLoading;

  const visibleCategoryNames = new Set(
    categories.filter((c) => c.showOnHome).map((c) => c.name)
  );

  const groupProjectsByCategory = (projects) => {
    const map = new Map();

    for (const project of projects) {
      const name = getCategoryName(project.category);
      if (!map.has(name)) map.set(name, []);
      map.get(name).push(project);
    }

    return Array.from(map.entries())
      .map(([categoryName, projects]) => ({ categoryName, projects }))
      .sort((a, b) => a.categoryName.localeCompare(b.categoryName));
  };

  const displayedCategories = isLoading 
    ? [] 
    : groupProjectsByCategory(
        projects.filter((p) => visibleCategoryNames.has(getCategoryName(p.category)))
      )
      .map((category) => ({
        ...category,
        projects: category.projects.slice(0, 4),
      }))
      .filter((category) => category.projects.length > 0);

  return { displayedCategories, isLoading };
}

export function useProject(id) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => projectApi.getById(id),
    enabled: !!id && id !== 'new',
  });
}

export function useProjectMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data) => projectApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => projectApi.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => projectApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  return {
    createProject: createMutation.mutateAsync,
    updateProject: updateMutation.mutateAsync,
    deleteProject: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
