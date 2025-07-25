import React from 'react';
import { View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import MentorHeader from './MentorHeader';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

interface MentorLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabPress?: (tab: string) => void;
  onNotifications?: () => void;
  onProfile?: () => void;
  onChangePassword?: () => void;
  headerColor?: string;
  hideFooter?: boolean; // <-- Adicionado
}

const MentorLayout: React.FC<MentorLayoutProps> = ({
  children,
  activeTab = 'dashboard',
  onTabPress,
  onNotifications,
  onProfile,
  onChangePassword,
  headerColor = '#ecfeff', // padrão bg-cyan-50
  hideFooter = false, // <-- Adicionado valor padrão
}) => {
  const { handleLogout } = useAuth();
  const insets = useSafeAreaInsets();
  const navigation: any = useNavigation();

  const containerClass = Platform.OS === 'web' ? 'layout-container' : 'flex-1';
  const contentClass = Platform.OS === 'web' ? 'layout-content' : 'flex-1';
  const tabBarWebHeight = 64;

  const handleLogoutPress = () => {
    handleLogout();
  };

  const handleProfile = () => {
    navigation.navigate('EditarPerfil');
  };

  const handleChangePassword = () => {
    navigation.navigate('TrocarSenha');
  };

  return (
    <>
      {/* StatusBar realmente translúcida */}
      <StatusBar translucent backgroundColor={headerColor} style="dark" />
      {/* View colorida para status bar (primeira coisa do layout) */}
      {Platform.OS !== 'web' && insets.top > 0 && (
        <View style={{ height: insets.top, backgroundColor: headerColor }} />
      )}
      <View className={`${containerClass} bg-white`} style={{ flex: 1 }}>
        {/* Header Melhorado */}
        <View style={{ backgroundColor: headerColor }}>
          <MentorHeader
            onLogout={handleLogoutPress}
            onNotifications={onNotifications}
            onProfile={handleProfile}
            onChangePassword={handleChangePassword}
            headerColor={headerColor}
          />
        </View>
        {/* Conteúdo Rolável */}
        <View
          className={contentClass}
          style={{
            flex: 1,
            paddingBottom: !hideFooter && Platform.OS === 'web' ? tabBarWebHeight : 0,
            marginBottom: 0,
            backgroundColor: 'white',
          }}
        >
          {children}
        </View>
        {/* Footer */}
        {!hideFooter && (
          <View style={{ height: tabBarWebHeight, backgroundColor: '#ecfeff' }} />
        )}
      </View>
    </>
  );
};

export default MentorLayout; 