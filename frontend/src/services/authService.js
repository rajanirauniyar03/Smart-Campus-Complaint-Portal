import api from './api';

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },

  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },

  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  getStaffList: async () => {
    const res = await api.get('/auth/staff');
    return res.data;
  },

  createStaff: async (staffData) => {
    const res = await api.post('/auth/staff', staffData);
    return res.data;
  },
};
