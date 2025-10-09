import axios from 'axios';

const REACT_BACKEND =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const api = REACT_BACKEND.endsWith('/api')
  ? REACT_BACKEND
  : `${REACT_BACKEND.replace(/\/$/, '')}/api`;

export const url = api; // optional alias

const axiosInstance = axios.create({
  baseURL: api,
});

// Attach token if present
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) { /* ignore */ }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
