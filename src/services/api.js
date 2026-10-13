import axios from 'axios';

// Normalize base URL so trailing slashes or omitted '/api' paths do not break requests in production
export const getApiBaseUrl = () => {
  const raw = import.meta.env.VITE_API_URL;
  if (raw && typeof raw === 'string' && raw.trim()) {
    let trimmed = raw.trim().replace(/\/+$/, '');
    if (trimmed.startsWith('http') && !trimmed.endsWith('/api')) {
      trimmed = `${trimmed}/api`;
    }
    return trimmed;
  }
  // Automatic fallback when running on Vercel
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return 'https://smart-campus-backend-3.onrender.com/api';
  }
  return '/api';
};

// Origin helper for uploaded assets / images
export const getBackendOrigin = () => {
  const socketUrl = import.meta.env.VITE_SOCKET_URL;
  if (socketUrl && typeof socketUrl === 'string' && socketUrl.trim()) {
    return socketUrl.trim().replace(/\/+$/, '');
  }
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl && typeof apiUrl === 'string' && apiUrl.trim().startsWith('http')) {
    return apiUrl.trim().replace(/\/+$/, '').replace(/\/api$/, '');
  }
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return 'https://smart-campus-backend-3.onrender.com';
  }
  return '';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
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
