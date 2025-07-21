import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Função para detectar se estamos na web
const isWeb = Platform.OS === 'web';

// Storage para web (localStorage)
const webStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Erro ao ler do localStorage:', error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Erro ao escrever no localStorage:', error);
    }
  },

  async deleteItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Erro ao deletar do localStorage:', error);
    }
  }
};

// Storage para mobile (SecureStore)
const mobileStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Erro ao ler do SecureStore:', error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Erro ao escrever no SecureStore:', error);
    }
  },

  async deleteItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Erro ao deletar do SecureStore:', error);
    }
  }
};

// Exportar o storage apropriado
export const storage = isWeb ? webStorage : mobileStorage; 