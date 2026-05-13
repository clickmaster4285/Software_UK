import api from '@/lib/axios';

export const blogApi = {
  getAll: async (drafts = false) => {
    const { data } = await api.get(`/blog${drafts ? '?drafts=1' : ''}`);
    return data;
  },
  
  getById: async (id, drafts = false) => {
    const { data } = await api.get(`/blog/${id}${drafts ? '?drafts=1' : ''}`);
    return data;
  },
  
  create: async (postData) => {
    const { data } = await api.post('/blog', postData);
    return data;
  },
  
  update: async (id, postData) => {
    const { data } = await api.put(`/blog/${id}`, postData);
    return data;
  },
  
  delete: async (id) => {
    const { data } = await api.delete(`/blog/${id}`);
    return data;
  }
};
