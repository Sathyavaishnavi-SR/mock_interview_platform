import API from './api.jsx';

// Auth
export const loginAdmin = async (credentials) => {
  const res = await API.post('/auth/login', credentials);
  return res.data;
};

export const logoutAdmin = async () => {
  const res = await API.post('/auth/logout');
  return res.data;
};

// Global Admin - Get all experiences
export const getAllExperiences = async (params = {}) => {
  const res = await API.get('/admin/global/experiences', { params });
  return res.data;
};

// Global Admin - Get dashboard stats
export const getGlobalStats = async () => {
  const res = await API.get('/admin/global/stats');
  return res.data;
};

// Global Admin - Get experience by ID
export const getExperienceById = async (id) => {
  const res = await API.get(`/admin/global/experiences/${id}`);
  return res.data;
};

// Global Admin - Accept experience
export const acceptExperience = async (id) => {
  const res = await API.patch(`/admin/global/experiences/${id}/accept`);
  return res.data;
};

// Global Admin - Reject experience
export const rejectExperience = async (id, reason) => {
  const res = await API.patch(`/admin/global/experiences/${id}/reject`, { reason });
  return res.data;
};

// Global Admin - Edit experience
export const editExperience = async (id, data) => {
  const res = await API.put(`/admin/global/experiences/${id}`, data);
  return res.data;
};

// Local Admin - Get department experiences
export const getDepartmentExperiences = async (params = {}) => {
  const res = await API.get('/admin/local/experiences', { params });
  return res.data;
};

// Local Admin - Get dashboard stats
export const getLocalStats = async () => {
  const res = await API.get('/admin/local/stats');
  return res.data;
};

// Local Admin - Get experience by ID
export const getLocalExperienceById = async (id) => {
  const res = await API.get(`/admin/local/experiences/${id}`);
  return res.data;
};

// Local Admin - Accept experience
export const localAcceptExperience = async (id) => {
  const res = await API.patch(`/admin/local/experiences/${id}/accept`);
  return res.data;
};

// Local Admin - Reject experience
export const localRejectExperience = async (id, reason) => {
  const res = await API.patch(`/admin/local/experiences/${id}/reject`, { reason });
  return res.data;
};