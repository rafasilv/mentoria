import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../services/api';
import { storage } from '../../utils/storage';

const TrocarSenhaScreen: React.FC = () => {
  const navigation = useNavigation();
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrocarSenha = async () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      Alert.alert('Preencha todos os campos!');
      return;
    }
    if (novaSenha !== confirmarSenha) {
      Alert.alert('As senhas não coincidem!');
      return;
    }
    setLoading(true);
    try {
      const token = await storage.getItem('token');
      await api.put(
        '/api/users/me/password',
        { senhaAtual, novaSenha },
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      Alert.alert('Senha alterada com sucesso!');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Erro ao trocar senha', err?.response?.data?.error || 'Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white px-4">
      {/* Botão de voltar */}
      <TouchableOpacity
        style={{ position: 'absolute', top: 40, left: 20, zIndex: 10 }}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={28} color="#0f766e" />
      </TouchableOpacity>
      <View className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
        <Text className="text-lg font-semibold text-slate-900 mb-6 text-center">Trocar Senha</Text>
        <View className="mb-4">
          <Text className="text-slate-700 mb-1">Senha atual</Text>
          <TextInput
            value={senhaAtual}
            onChangeText={setSenhaAtual}
            className="border border-gray-200 rounded-lg px-3 py-2 text-base text-slate-900"
            placeholder="Digite sua senha atual"
            secureTextEntry
          />
        </View>
        <View className="mb-4">
          <Text className="text-slate-700 mb-1">Nova senha</Text>
          <TextInput
            value={novaSenha}
            onChangeText={setNovaSenha}
            className="border border-gray-200 rounded-lg px-3 py-2 text-base text-slate-900"
            placeholder="Digite a nova senha"
            secureTextEntry
          />
        </View>
        <View className="mb-6">
          <Text className="text-slate-700 mb-1">Confirmar nova senha</Text>
          <TextInput
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            className="border border-gray-200 rounded-lg px-3 py-2 text-base text-slate-900"
            placeholder="Confirme a nova senha"
            secureTextEntry
          />
        </View>
        <TouchableOpacity
          className="bg-cyan-600 rounded-lg py-3 items-center"
          onPress={handleTrocarSenha}
          disabled={loading}
        >
          <Text className="text-white font-semibold text-base">Trocar Senha</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TrocarSenhaScreen; 