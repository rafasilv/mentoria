import React from 'react';
import { TouchableOpacity, View, Text, Alert, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface CreatePostButtonProps {
  onPress: () => void;
}

const CreatePostButton = ({ onPress }: CreatePostButtonProps) => {
  const handlePress = () => {
    Alert.alert(
      'Criar Post',
      'Funcionalidade em desenvolvimento! Em breve você poderá criar posts para compartilhar com seus mentorados.',
      [
        { text: 'OK', onPress: () => onPress() }
      ]
    );
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        position: 'absolute',
        right: 24,
        bottom: 32,
        zIndex: 20,
        backgroundColor: '#14b8a6',
        borderRadius: 32,
        padding: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon name="add" size={28} color="#fff" />
    </TouchableOpacity>
  );
};

export default CreatePostButton; 