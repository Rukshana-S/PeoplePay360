import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Interceptor to attach the mock user headers for backend authentication
api.interceptors.request.use((config) => {
  const userStr = localStorage.getItem('peoplepay360_user_session');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.id) {
        config.headers['user-id'] = user.id;
      }
      if (user.role) {
        config.headers['user-role'] = user.role;
      }
    } catch (e) {
      console.error('Failed to parse user from localStorage');
    }
  }
  return config;
});

// Interceptor to handle responses and global errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // We can handle global 401s here if needed
    if (error.response?.status === 401) {
      localStorage.removeItem('peoplepay360_user_session');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
