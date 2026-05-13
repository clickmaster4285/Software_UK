import api from '@/lib/axios';

export const projectApi = {
  getAll: async () => {
    const { data } = await api.get('/projects');
    return data;
  },
  
  getById: async (id) => {
    const { data } = await api.get(`/projects/${id}`);
    return data;
  },
  
  create: async (projectData) => {
    const { data } = await api.post('/projects', projectData);
    return data;
  },
  
  update: async (id, projectData) => {
    const { data } = await api.put(`/projects?id=${id}`, projectData);
    return data;
  },
  
  delete: async (id) => {
    const { data } = await api.delete(`/projects?id=${id}`);
    return data;
  }
};
