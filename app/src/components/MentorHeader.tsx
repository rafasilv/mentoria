import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LogoHybrid from './LogoHybrid';
import { useAuth } from '../contexts/AuthContext';

interface MentorHeaderProps {
  onLogout: () => void;
  onNotifications?: () => void;
  onProfile?: () => void;
  onChangePassword?: () => void;
  headerColor?: string;
}

const MentorHeader: React.FC<MentorHeaderProps> = ({
  onLogout,
  onNotifications,
  onProfile,
  onChangePassword,
  headerColor = '#ecfeff',
}) => {
  const { user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });

  // Limpar portal quando componente for desmontado
  useEffect(() => {
    return () => {
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        const portal = document.querySelector('.dropdown-portal');
        if (portal) portal.remove();
      }
    };
  }, []);

  // Fechar dropdown quando clicar fora (apenas na web)
  useEffect(() => {
    if (Platform.OS === 'web' && showDropdown) {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Element;
        if (!target.closest('.profile-dropdown') && !target.closest('.dropdown-portal')) {
          setShowDropdown(false);
          // Limpar portal
          const portal = document.querySelector('.dropdown-portal');
          if (portal) portal.remove();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showDropdown]);

  const handleProfilePress = () => {
    if (Platform.OS === 'web') {
      // Calcular posição do dropdown na web
      const button = document.querySelector('.profile-button');
      if (button) {
        const rect = button.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 8,
          right: window.innerWidth - rect.right
        });
      }
    }
    setShowDropdown(!showDropdown);
  };

  const handleOptionPress = (action?: () => void) => {
    setShowDropdown(false);
    if (action) {
      action();
    }
  };

  const DropdownContent = () => (
    <View className="bg-white rounded-xl shadow-lg border border-gray-200 min-w-48 dropdown-portal">
      <TouchableOpacity
        className="flex-row items-center px-4 py-3 border-b border-gray-100"
        onPress={() => handleOptionPress(onProfile)}
      >
        <Icon name="person" size={20} color="#64748b" />
        <Text className="ml-3 text-slate-700 font-medium">Perfil</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        className="flex-row items-center px-4 py-3 border-b border-gray-100"
        onPress={() => handleOptionPress(onChangePassword)}
      >
        <Icon name="lock" size={20} color="#64748b" />
        <Text className="ml-3 text-slate-700 font-medium">Trocar Senha</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        className="flex-row items-center px-4 py-3"
        onPress={() => handleOptionPress(onLogout)}
      >
        <Icon name="logout" size={20} color="#dc2626" />
        <Text className="ml-3 text-red-600 font-medium">Sair</Text>
      </TouchableOpacity>
    </View>
  );

  // Renderizar dropdown no portal para web
  const renderWebDropdown = () => {
    if (Platform.OS === 'web' && showDropdown && typeof document !== 'undefined') {
      const portalContainer = document.createElement('div');
      portalContainer.style.cssText = `
        position: fixed;
        top: ${dropdownPosition.top}px;
        right: ${dropdownPosition.right}px;
        z-index: 999999;
        pointer-events: auto;
      `;
      portalContainer.className = 'dropdown-portal';
      
      // Limpar portal anterior se existir
      const existingPortal = document.querySelector('.dropdown-portal');
      if (existingPortal) {
        existingPortal.remove();
      }
      
      document.body.appendChild(portalContainer);
      
      // Renderizar o conteúdo do dropdown
      const dropdownElement = document.createElement('div');
      dropdownElement.innerHTML = `
        <div class="bg-white rounded-xl shadow-lg border border-gray-200 min-w-48">
          <div class="flex items-center px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50" onclick="window.handleProfileOption('profile')">
            <svg class="w-5 h-5 text-gray-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-slate-700 font-medium">Perfil</span>
          </div>
          <div class="flex items-center px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50" onclick="window.handleProfileOption('password')">
            <svg class="w-5 h-5 text-gray-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-slate-700 font-medium">Trocar Senha</span>
          </div>
          <div class="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50" onclick="window.handleProfileOption('logout')">
            <svg class="w-5 h-5 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm7 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-1 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-red-600 font-medium">Sair</span>
          </div>
        </div>
      `;
      
      portalContainer.appendChild(dropdownElement);
      
      // Adicionar handlers globais
      (window as any).handleProfileOption = (action: string) => {
        setShowDropdown(false);
        switch (action) {
          case 'profile':
            if (onProfile) onProfile();
            break;
          case 'password':
            if (onChangePassword) onChangePassword();
            break;
          case 'logout':
            onLogout();
            break;
        }
        // Limpar portal
        const portal = document.querySelector('.dropdown-portal');
        if (portal) portal.remove();
      };
      
      return null;
    }
    return null;
  };

  return (
    <View className="border-b-2 border-cyan-100" style={{ backgroundColor: headerColor }}>
      <View className="px-6 py-4 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <LogoHybrid width={80} height={36} />
        </View>
        
        <View className="relative profile-dropdown">
          <TouchableOpacity
            className="p-2 rounded-full bg-white shadow-sm profile-button"
            onPress={handleProfilePress}
          >
            <Icon name="account-circle" size={24} color="#0f766e" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Renderizar dropdown no portal para web */}
      {renderWebDropdown()}

      {/* Dropdown Modal para Mobile */}
      {Platform.OS !== 'web' && (
        <Modal
          visible={showDropdown}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDropdown(false)}
          statusBarTranslucent={true}
        >
          <View className="flex-1 justify-start items-end pt-20 pr-6">
            <TouchableOpacity
              className="absolute inset-0 bg-transparent"
              onPress={() => setShowDropdown(false)}
              activeOpacity={1}
            />
            <DropdownContent />
          </View>
        </Modal>
      )}
    </View>
  );
};

export default MentorHeader; 