import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Image, Platform } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface MentorProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

const MentorProfileModal: React.FC<MentorProfileModalProps> = ({ visible, onClose }) => {
  const { user } = useAuth();
  const [nome, setNome] = useState(user?.nome || '');
  // Placeholder para foto de perfil
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Resetar nome ao abrir modal
  React.useEffect(() => {
    if (visible) setNome(user?.nome || '');
  }, [visible, user]);

  // Handler para trocar foto (ainda não implementado)
  const handleChangePhoto = () => {
    // Aqui entraria lógica de picker de imagem
    alert('Funcionalidade de trocar foto em breve!');
  };

  // Handler para salvar (apenas fecha o modal por enquanto)
  const handleSave = () => {
    // Aqui entraria lógica de salvar nome/foto
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View className="flex-1 justify-center items-center bg-black/40 px-4">
        <View className="bg-white rounded-2xl p-6 w-full max-w-md">
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
            <Text className="text-lg font-semibold text-slate-900">Perfil do Mentor</Text>
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

          <View className="flex-row justify-end gap-2">
            <TouchableOpacity onPress={onClose} className="px-4 py-2 rounded-lg bg-gray-100">
              <Text className="text-slate-700 font-medium">Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} className="px-4 py-2 rounded-lg bg-cyan-600">
              <Text className="text-white font-medium">Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MentorProfileModal; 