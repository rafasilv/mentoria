import axios from 'axios';
import { storage } from '../utils/storage';

// Detectar se está rodando na web ou mobile
const isWeb = typeof window !== 'undefined' && window.location;

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || (isWeb ? 'http://localhost:3000' : 'http://192.168.18.32:3000'),
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await storage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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

export const updateProfile = async (nome: string, fotoUri?: string) => {
  const formData = new FormData();
  formData.append('nome', nome);
  if (fotoUri) {
    // Extrai nome do arquivo
    const filename = fotoUri.split('/').pop() || 'profile.jpg';
    const match = /\.([a-zA-Z0-9]+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image';
    formData.append('foto', {
      uri: fotoUri,
      name: filename,
      type,
    } as any);
  }
  const res = await api.put('/api/users/me', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
}; 