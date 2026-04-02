import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Auto logout or handle unauthorized
      // For now, we optionally clear token if it's invalid
      console.warn("Unauthorized access - possible invalid token.");
    }
    return Promise.reject(error);
  }
);

export default api;
