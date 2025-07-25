import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Platform } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { updateProfile } from '../../services/api';

const EditarPerfilScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [nome, setNome] = useState(user?.nome || '');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  React.useEffect(() => {
    setNome(user?.nome || '');
  }, [user]);

  const handleChangePhoto = async () => {
    // Solicita permissão
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permissão para acessar a galeria é necessária!');
      return;
    }
    // Abre o seletor de imagem
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      const updatedUser = await updateProfile(nome, profileImage || undefined);
      alert('Perfil atualizado com sucesso!');
      // Atualizar contexto do usuário se possível
      // Exemplo: setUser(updatedUser);
      navigation.goBack();
    } catch (err) {
      alert('Erro ao atualizar perfil.');
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
        <View className="items-center mb-4">
          <TouchableOpacity onPress={handleChangePhoto} className="mb-2">
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={{ width: 80, height: 80, borderRadius: 40 }} />
            ) : (
              <Icon name="account-circle" size={80} color="#0f766e" />
            )}
            <View className="absolute bottom-0 right-0 bg-cyan-600 rounded-full p-1">
              <Icon name="photo-camera" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-slate-900">Editar Perfil</Text>
        </View>

        <View className="mb-4">
          <Text className="text-slate-700 mb-1">Nome</Text>
          <TextInput
            value={nome}
            onChangeText={setNome}
            className="border border-gray-200 rounded-lg px-3 py-2 text-base text-slate-900"
            placeholder="Seu nome"
          />
        </View>

        <View className="mb-6">
          <Text className="text-slate-700 mb-1">E-mail</Text>
          <View className="border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
            <Text className="text-base text-slate-500">{user?.email}</Text>
          </View>
        </View>

        <TouchableOpacity
          className="bg-cyan-600 rounded-lg py-3 items-center"
          onPress={handleSave}
        >
          <Text className="text-white font-semibold text-base">Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditarPerfilScreen; 