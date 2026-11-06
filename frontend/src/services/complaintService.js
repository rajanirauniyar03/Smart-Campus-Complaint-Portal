import api from './api';

export const complaintService = {
  getComplaints: async (params = {}) => {
    const res = await api.get('/complaints', { params });
    return res.data;
  },

  getComplaintById: async (id) => {
    const res = await api.get(`/complaints/${id}`);
    return res.data;
  },

  createComplaint: async (formData) => {
    // Note: formData may be FormData object for image upload or standard JSON
    const headers = formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const res = await api.post('/complaints', formData, { headers });
    return res.data;
  },

  assignComplaint: async (id, assignData) => {
    const res = await api.put(`/complaints/${id}/assign`, assignData);
    return res.data;
  },

  updateStatusByAdmin: async (id, updateData) => {
    const res = await api.put(`/complaints/${id}/status`, updateData);
    return res.data;
  },

  updateProgressByStaff: async (id, formData) => {
    const headers = formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const res = await api.put(`/complaints/${id}/staff-update`, formData, { headers });
    return res.data;
  },

  addComment: async (id, message) => {
    const res = await api.post(`/complaints/${id}/comments`, { message });
    return res.data;
  },

  resetDemoData: async () => {
    const res = await api.post('/seed');
    return res.data;
  },
};
