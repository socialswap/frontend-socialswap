// src/API/api.js
import axios from 'axios';

const REACT_BACKEND = process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
// ensure base has /api (server mounts routes under /api)
export const api = REACT_BACKEND.endsWith('/api') ? REACT_BACKEND : `${REACT_BACKEND.replace(/\/$/, '')}/api`;

const axiosInstance = axios.create({
  baseURL: api
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // your app JWT returned by backend
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
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
