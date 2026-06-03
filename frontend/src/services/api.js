import axios from 'axios';

// Initialize Axios client with proxy base path
const API = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to dynamically inject authorization headers
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  login: async (email, password) => {
    const response = await API.post('/api/auth/login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  register: async (name, email, password) => {
    const response = await API.post('/api/auth/register', { name, email, password });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export const scanService = {
  predictEmail: async (emailText) => {
    const response = await API.post('/api/predict/email', { email_text: emailText });
    return response.data;
  },
  predictUrl: async (url) => {
    const response = await API.post('/api/predict/url', { url });
    return response.data;
  },
  getHistory: async () => {
    const response = await API.get('/api/predict/history');
    return response.data;
  }
};

export const dashboardService = {
  getStats: async () => {
    const response = await API.get('/api/dashboard/stats');
    return response.data;
  },
  getAnalytics: async () => {
    const response = await API.get('/api/dashboard/analytics');
    return response.data;
  }
};

export const adminService = {
  getUsers: async () => {
    const response = await API.get('/api/admin/users');
    return response.data;
  },
  getLogs: async () => {
    const response = await API.get('/api/admin/logs');
    return response.data;
  },
  getMetricsList: async () => {
    const response = await API.get('/api/admin/metrics');
    return response.data;
  },
  retrainModel: async () => {
    const response = await API.post('/api/admin/retrain-model');
    return response.data;
  },
  downloadScansCsvUrl: '/api/admin/export-csv'
};

export default API;
