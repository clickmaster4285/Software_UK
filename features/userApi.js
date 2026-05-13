import api from '@/lib/axios';

export const userApi = {
  login: async (email, password) => {
    const { data } = await api.post('/users', { email, password });
    return data;
  },
  
  logout: async () => {
    const { data } = await api.delete('/users');
    return data;
  },
  
  me: async () => {
    const { data } = await api.get('/users');
    return data;
  },

  update: async (data) => {
    const { data: response } = await api.put('/users', data);
    return response;
  }
};
