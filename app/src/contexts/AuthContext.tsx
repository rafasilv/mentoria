import React, { createContext, useContext, useEffect, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { api } from '../services/api';
import { storage } from '../utils/storage';

interface User {
  id: string;
  nome: string;
  email: string;
  tipo_usuario: 'MENTOR' | 'MENTORADO';
  timezone: string;
  mentor_id?: string;
  notificacoes_ativas: boolean;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkBiometric: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      console.log('🔍 Carregando autenticação armazenada...');
      const storedToken = await storage.getItem('token');
      const storedUser = await storage.getItem('user');

      console.log('📱 Token armazenado:', storedToken ? 'Sim' : 'Não');
      console.log('👤 Usuário armazenado:', storedUser ? 'Sim' : 'Não');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        api.defaults.headers.authorization = `Bearer ${storedToken}`;
        console.log('✅ Autenticação carregada com sucesso');
      } else {
        console.log('❌ Nenhuma autenticação armazenada');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar autenticação:', error);
    } finally {
      console.log('🏁 Finalizando carregamento da autenticação');
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Tentando fazer login...', { email });
      
      const response = await api.post('/auth/login', {
        email,
        senha: password
      });

      console.log('✅ Login bem-sucedido:', response.data);

      const { user: userData, token: tokenData } = response.data;

      setUser(userData);
      setToken(tokenData);
      api.defaults.headers.authorization = `Bearer ${tokenData}`;

      await storage.setItem('token', tokenData);
      await storage.setItem('user', JSON.stringify(userData));
      
      console.log('💾 Dados salvos no storage');
    } catch (error) {
      console.error('❌ Erro no login:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (token) {
        await api.post('/auth/logout');
      }
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      setUser(null);
      setToken(null);
      delete api.defaults.headers.authorization;
      await storage.deleteItem('token');
      await storage.deleteItem('user');
    }
  };

  const checkBiometric = async (): Promise<boolean> => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        return false;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autentique-se para continuar',
        fallbackLabel: 'Usar senha'
      });

      return result.success;
    } catch (error) {
      console.error('Erro na autenticação biométrica:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      signIn,
      signOut,
      checkBiometric
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 