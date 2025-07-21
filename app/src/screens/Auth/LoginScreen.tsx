import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Alert, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator 
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import LogoHybrid from '../../components/LogoHybrid';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setIsLoading(true);
    try {
      await signIn(email, password);
    } catch (error) {
      Alert.alert('Erro', 'Credenciais inválidas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          style={{ flex: 1 }}
          className="force-scroll"
        >
          <View className="px-6 py-8">
            {/* Header with Logo */}
            <View className="items-center mb-12">
              <LogoHybrid width={140} height={63} className="mb-6" />
              <Text className="text-teal-600 text-center font-light text-base">
                Mentoria
              </Text>
            </View>

            {/* Login Container */}
            <View className="bg-white rounded-2xl shadow-lg p-8 mx-2">
              

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
                  <View className="flex-row items-center">
                    <TextInput
                      className="flex-1 px-4 py-4 text-lg text-slate-900 font-light"
                      placeholder="••••••••"
                      placeholderTextColor="#9ca3af"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoComplete="password"
                    />
                    <TouchableOpacity 
                      className="px-4 py-4"
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Text className="text-teal-500 text-xl">
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              
              {/* Login Button */}
              <TouchableOpacity
                className="bg-teal-600 py-4 rounded-xl items-center justify-center active:bg-teal-700 shadow-md mb-6"
                onPress={handleLogin}
                disabled={isLoading}
                style={{
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                <View className="flex-row items-center">
                  {isLoading && (
                    <ActivityIndicator size="small" color="#ffffff" style={{ marginRight: 12 }} />
                  )}
                  <Text className="text-white font-semibold text-lg">
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Forgot Password */}
              <TouchableOpacity className="items-center py-2">
                <Text className="text-teal-600 font-medium">
                  Esqueceu sua senha?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View className="items-center mt-8">
              <Text className="text-slate-400 text-xs font-light">
                Desenvolvido com NativeWind
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen; 