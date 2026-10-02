import api from './axiosClient';

// Auth API
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

// Project API
export const projectApi = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

// Character API
export const characterApi = {
  getByProject: (projectId) => api.get(`/projects/${projectId}/characters`),
  create: (projectId, data) => api.post(`/projects/${projectId}/characters`, data),
  getById: (id) => api.get(`/characters/${id}`),
  update: (id, data) => api.put(`/characters/${id}`, data),
  delete: (id) => api.delete(`/characters/${id}`),
};

// Scene API
export const sceneApi = {
  getByProject: (projectId) => api.get(`/projects/${projectId}/scenes`),
  create: (projectId, data) => api.post(`/projects/${projectId}/scenes`, data),
  getById: (id) => api.get(`/scenes/${id}`),
  update: (id, data) => api.put(`/scenes/${id}`, data),
  delete: (id) => api.delete(`/scenes/${id}`),
  reorder: (projectId, sceneIds) => api.post(`/projects/${projectId}/scenes/reorder`, { sceneIds }),
};

// AI API
export const aiApi = {
  analyzeStory: (data) => api.post('/ai/analyze-story', data),
  generateCharacter: (data) => api.post('/ai/generate-character', data),
  generateSceneImage: (data) => api.post('/ai/generate-scene-image', data),
  generateVideo: (data) => api.post('/ai/generate-video', data),
  generateVoice: (data) => api.post('/ai/generate-voice', data),
  renderTimeline: (data) => api.post('/ai/render-timeline', data),
};

// Jobs API
export const jobApi = {
  getById: (id) => api.get(`/jobs/${id}`),
  getAll: (projectId) => api.get('/jobs', { params: { projectId } }),
};

// Audio API
export const audioApi = {
  getLibrary: () => api.get('/audio/library'),
  attachToScene: (data) => api.post('/audio/attach', data),
};
