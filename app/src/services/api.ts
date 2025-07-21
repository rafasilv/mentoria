import axios from 'axios';

// Detectar se está rodando na web ou mobile
const isWeb = typeof window !== 'undefined' && window.location;

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || (isWeb ? 'http://localhost:3000' : 'http://192.168.18.32:3000'),
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    console.log('Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.config?.url);
    return Promise.reject(error);
  }
); 