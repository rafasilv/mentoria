import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import LogoHybrid from './LogoHybrid';

interface LayoutProps {
  children: React.ReactNode;
  hideHeaderFooter?: boolean;
  transparentHeaderFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  hideHeaderFooter = false,
  transparentHeaderFooter = false 
}) => {
  const { user, handleLogout } = useAuth();

  // No mobile, usamos flex normal do React Native
  const containerClass = Platform.OS === 'web' ? 'layout-container' : 'flex-1';
  const headerClass = Platform.OS === 'web' ? 'layout-header' : '';
  const contentClass = Platform.OS === 'web' ? 'layout-content' : 'flex-1';
  const footerClass = Platform.OS === 'web' ? 'layout-footer' : '';

  // Classes condicionais para header/footer transparente
  const headerBgClass = transparentHeaderFooter ? 'bg-white' : 'border-b-2 border-cyan-100 bg-cyan-50';
  const footerBgClass = transparentHeaderFooter ? 'bg-white' : 'border-t-2 border-cyan-100 bg-cyan-50';

  return (
    <SafeAreaView className={`${containerClass} bg-white`}>
      {/* Header Fixo */}
      {!hideHeaderFooter && (
        <View className={`${headerClass} ${headerBgClass}`}>
          {!transparentHeaderFooter && (
            <View className="px-6 py-4 flex-row justify-between items-center">
              <View className="flex-row items-center">
                <LogoHybrid width={80} height={36} />
                <Text className="ml-4 text-lg font-light text-slate-900">
                  {user?.tipo_usuario === 'MENTOR' ? 'Mentor' : 'Mentorado'}
                </Text>
              </View>
              
              <TouchableOpacity
                className="border-2 border-cyan-200 px-4 py-2 rounded-xl active:bg-cyan-50"
                onPress={handleLogout}
              >
                <Text className="text-cyan-700 font-medium">Sair</Text>
              </TouchableOpacity>
            </View>
          )}
          {transparentHeaderFooter && <View className="py-4" />}
        </View>
      )}

      {/* Conteúdo Rolável */}
      <View className={contentClass}>
        {children}
      </View>

      {/* Footer Fixo */}
      {!hideHeaderFooter && (
        <View className={`${footerClass} ${footerBgClass}`}>
          {!transparentHeaderFooter && (
            <View className="px-6 py-4">
              <Text className="text-center text-sm text-cyan-700">
                Sistema de Mentoria © 2024
              </Text>
            </View>
          )}
          {transparentHeaderFooter && <View className="py-4" />}
        </View>
      )}
    </SafeAreaView>
  );
};

export default Layout; 