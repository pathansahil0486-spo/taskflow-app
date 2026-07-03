import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

const SKIP_REDIRECT_PATHS = ['/auth/me', '/auth/login', '/auth/register', '/auth/logout'];

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthFlowRequest = SKIP_REDIRECT_PATHS.some((path) =>
      error.config?.url?.includes(path)
    );

    if (error.response?.status === 401 && !isAuthFlowRequest) {
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  logout: () => API.post('/auth/logout'),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
  changePassword: (data) => API.put('/auth/password', data),
  forgotPassword: (data) => API.post('/auth/forgot-password', data),
  resetPassword: (token, data) => API.put(`/auth/reset-password/${token}`, data),
};

export const todoAPI = {
  getAll: (params) => API.get('/todos', { params }),
  create: (data) => API.post('/todos', data),
  getOne: (id) => API.get(`/todos/${id}`),
  update: (id, data) => API.put(`/todos/${id}`, data),
  delete: (id) => API.delete(`/todos/${id}`),
  clearCompleted: () => API.delete('/todos/completed/clear'),
  toggleAll: (completed) => API.put('/todos/toggle-all', { completed }),
  getCategories: () => API.get('/todos/categories'),
};

export default API;