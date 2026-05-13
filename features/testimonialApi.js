import api from '@/lib/axios';

export const testimonialApi = {
  getAll: async () => {
    const { data } = await api.get('/testimonials');
    return data;
  },
  
  getById: async (id) => {
    const { data } = await api.get(`/testimonials?id=${id}`);
    return data;
  },
  
  create: async (testimonialData) => {
    const { data } = await api.post('/testimonials', testimonialData);
    return data;
  },
  
  update: async (id, testimonialData) => {
    const { data } = await api.put(`/testimonials?id=${id}`, testimonialData);
    return data;
  },
  
  delete: async (id) => {
    const { data } = await api.delete(`/testimonials?id=${id}`);
    return data;
  }
};
