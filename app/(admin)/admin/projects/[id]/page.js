'use client';

import { useProject } from '@/hooks/useProjects';
import ProjectForm from '@/components/admin/ProjectForm';
import { use } from 'react';

export default function ProjectEditPage({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const { data: project, isLoading } = useProject(id);

  if (id !== 'new' && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <ProjectForm initialData={project} id={id} />;
}
