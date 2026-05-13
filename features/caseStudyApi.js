import api from '@/lib/axios';

export const caseStudyApi = {
  getAll: async (drafts = false) => {
    const { data } = await api.get(`/case-studies${drafts ? '?drafts=1' : ''}`);
    return data;
  },
  
  getById: async (id, drafts = false) => {
    const { data } = await api.get(`/case-studies/${id}${drafts ? '?drafts=1' : ''}`);
    return data;
  },
  
  create: async (caseStudyData) => {
    const { data } = await api.post('/case-studies', caseStudyData);
    return data;
  },
  
  update: async (id, caseStudyData) => {
    const { data } = await api.put(`/case-studies/${id}`, caseStudyData);
    return data;
  },
  
  delete: async (id) => {
    const { data } = await api.delete(`/case-studies/${id}`);
    return data;
  }
};
