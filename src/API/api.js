import axios from 'axios';


export const api = process.env.REACT_APP_API_BASE_URL
export const url = process.env.REACT_APP_BACKEND
const isMutation = (config) =>
  ['post', 'put', 'patch', 'delete'].includes(config?.method?.toLowerCase());

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Invalidate cache on mutations
    if (isMutation(config)) {
      clearApiCache();
    }

    // Get token from localStorage
    const token = localStorage.getItem('token');

    // If token exists, add it to Authorization header
    if (token) {
      config.headers['x-auth-token'] = token;  // Or 'Authorization' if using Bearer scheme
    }

    return config;
  },
  (error) => {
    // Handle error
    return Promise.reject(error);
  }
);

// Optionally, add a response interceptor for handling responses
axiosInstance.interceptors.response.use(
  (response) => {
    // Clear again in case a read finished while this write was still running
    if (isMutation(response.config)) {
      clearApiCache();
    }
    return response;
  },
  (error) => {
    // Handle error response (e.g., token expiration, server errors)
    if (error.response?.status === 401) {
      // You can handle token expiry or other auth issues here
      console.log('Unauthorized, redirecting to login...');
      localStorage.clear()
      window.location.href = '/login'

    }
    return Promise.reject(error);
  }
);

const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000;
const CART_CACHE_TTL_MS = 30 * 1000;

export const apiCache = new Map();
const cacheExpiry = new Map();
const inFlightRequests = new Map();

export const clearApiCache = () => {
  apiCache.clear();
  cacheExpiry.clear();
  inFlightRequests.clear();
};

// Identical requests made at the same time share one network call.
export const cachedGet = (url, config = {}, ttlMs = DEFAULT_CACHE_TTL_MS) => {
  if (apiCache.has(url) && cacheExpiry.get(url) > Date.now()) {
    return Promise.resolve(apiCache.get(url));
  }
  if (inFlightRequests.has(url)) {
    return inFlightRequests.get(url);
  }

  const request = axiosInstance.get(url, config)
    .then((response) => {
      // Skip saving if a write cleared the cache while this was loading
      if (inFlightRequests.get(url) === request) {
        apiCache.set(url, response);
        cacheExpiry.set(url, Date.now() + ttlMs);
      }
      return response;
    })
    .finally(() => {
      if (inFlightRequests.get(url) === request) {
        inFlightRequests.delete(url);
      }
    });

  inFlightRequests.set(url, request);
  return request;
};

// Every channel card asks whether it is in the cart, so this must stay shared.
export const getCart = () => cachedGet('/cart', {}, CART_CACHE_TTL_MS);

export default axiosInstance;
