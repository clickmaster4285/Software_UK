import api from '@/lib/axios';

export const categoryApi = {
  getAll: async () => {
    const { data } = await api.get('/categories');
    return data;
  },
  
  getById: async (id) => {
    const { data } = await api.get(`/categories?id=${id}`);
    return data;
  },
  
  create: async (categoryData) => {
    const { data } = await api.post('/categories', categoryData);
    return data;
  },
  
  update: async (id, categoryData) => {
    const { data } = await api.put(`/categories?id=${id}`, categoryData);
    return data;
  },
  
  delete: async (id) => {
    const { data } = await api.delete(`/categories?id=${id}`);
    return data;
  }
};
