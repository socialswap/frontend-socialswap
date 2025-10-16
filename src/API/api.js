import axios from 'axios';


export const api = process.env.REACT_APP_API_BASE_URL
export const url = process.env.REACT_APP_BACKEND
// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
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
   return response
},  
  (error) => {
    // Handle error response (e.g., token expiration, server errors)
    if (error.response.status === 401) {
      // You can handle token expiry or other auth issues here
      console.log('Unauthorized, redirecting to login...');
      localStorage.clear()
      window.location.href = '/login'

    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
