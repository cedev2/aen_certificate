import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aen_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('aen_token');
      localStorage.removeItem('aen_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Certificate API
export const certificateAPI = {
  list: (params?: { search?: string; status?: string; page?: number; limit?: number }) =>
    api.get('/certificates', { params }),
  get: (id: string) => api.get(`/certificates/${id}`),
  create: (data: any) => api.post('/certificates', data),
  update: (id: string, data: any) => api.put(`/certificates/${id}`, data),
  revoke: (id: string) => api.post(`/certificates/${id}/revoke`),
  delete: (id: string) => api.delete(`/certificates/${id}`),
  stats: () => api.get('/certificates/stats'),
};

// Signatory API
export const signatoryAPI = {
  list: () => api.get('/signatories'),
  create: (formData: FormData) =>
    api.post('/signatories', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, formData: FormData) =>
    api.put(`/signatories/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: string) => api.delete(`/signatories/${id}`),
};

// Brand API
export const brandAPI = {
  getAssets: () => api.get('/brand'),
  getLogo: () => api.get('/brand/logo'),
  uploadLogo: (formData: FormData) =>
    api.post('/brand/logo', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};
