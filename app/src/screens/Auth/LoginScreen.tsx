import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import LogoHybrid from '../../components/LogoHybrid';
import Layout from '../../components/Layout';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();

  const handleLogin = async () => {
    try {
      await signIn(email, password);
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };

  return (
    <Layout transparentHeaderFooter>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6 py-8">
          {/* Header with Logo */}
          <View className="items-center mb-12">
            <LogoHybrid width={140} height={63} className="mb-6" />
            <Text className="text-teal-600 text-center font-light text-base">
              Mentoria
            </Text>
          </View>

          {/* Login Container */}
          <View className="bg-white rounded-3xl shadow p-8 mx-2">
            {/* Styled Email Input */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-slate-700 mb-2">
                Email
              </Text>
              <View className="bg-gray-50 rounded-xl border-2 border-gray-100 focus-within:border-teal-500 focus-within:bg-white">
                <TextInput
                  className="px-4 py-4 text-lg text-slate-900 font-light"
                  placeholder="seu@email.com"
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
            </View>
            
            {/* Styled Password Input */}
            <View className="mb-8">
              <Text className="text-sm font-medium text-slate-700 mb-2">
                Senha
              </Text>
              <View className="bg-gray-50 rounded-xl border-2 border-gray-100 focus-within:border-teal-500 focus-within:bg-white">
                <TextInput
                  className="px-4 py-4 text-lg text-slate-900 font-light"
                  placeholder="••••••••"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="password"
                />
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className="bg-teal-600 rounded-xl py-4 active:bg-teal-700"
              onPress={handleLogin}
            >
              <Text className="text-white text-center font-medium text-lg">
                Entrar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Layout>
  );
};

export default LoginScreen; 