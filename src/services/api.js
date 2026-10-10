import axios from 'axios';

const api = axios.create({
  // Use Vite's same-origin proxy by default so browser CORS and host/port changes
  // cannot silently prevent API requests from reaching Spring Boot.
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000
});

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('cs_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cs_token');
      localStorage.removeItem('cs_user');
      if (!window.location.pathname.includes('/login')) window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
