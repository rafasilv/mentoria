import React from 'react';
import { View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import MentorHeader from './MentorHeader';
import { useAuth } from '../contexts/AuthContext';

interface MentorLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabPress?: (tab: string) => void;
  onNotifications?: () => void;
  onProfile?: () => void;
  onChangePassword?: () => void;
  headerColor?: string;
}

const MentorLayout: React.FC<MentorLayoutProps> = ({
  children,
  activeTab = 'dashboard',
  onTabPress,
  onNotifications,
  onProfile,
  onChangePassword,
  headerColor = '#ecfeff', // padrão bg-cyan-50
}) => {
  const { handleLogout } = useAuth();
  const insets = useSafeAreaInsets();

  const containerClass = Platform.OS === 'web' ? 'layout-container' : 'flex-1';
  const contentClass = Platform.OS === 'web' ? 'layout-content' : 'flex-1';
  const tabBarWebHeight = 64;

  const handleLogoutPress = () => {
    handleLogout();
  };

  return (
    <>
      {/* StatusBar realmente translúcida */}
      <StatusBar translucent backgroundColor="transparent" style="dark" />
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
            onProfile={onProfile}
            onChangePassword={onChangePassword}
            headerColor={headerColor}
          />
        </View>
        {/* Conteúdo Rolável */}
        <View
          className={contentClass}
          style={{
            flex: 1,
            paddingBottom: Platform.OS === 'web' ? tabBarWebHeight : 0,
            marginBottom: 0,
          }}
        >
          {children}
        </View>
      </View>
    </>
  );
};

export default MentorLayout; 