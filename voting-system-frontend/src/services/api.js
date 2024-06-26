import axios from 'axios';

const api = axios.create({
  baseURL: 'http://172.210.38.57/api', // Assurez-vous que cette URL est correcte
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export default api;
