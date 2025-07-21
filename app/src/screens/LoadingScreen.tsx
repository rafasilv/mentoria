import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import LogoHybrid from '../components/LogoHybrid';

const LoadingScreen = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      {/* Hybrid Logo (SVG nativo na web, LogoSVG no mobile) */}
      <View className="items-center mb-12">
        <LogoHybrid width={120} height={54} className="mb-8" />
        
        {/* Clean Loading with Brand Colors */}
        <ActivityIndicator size="large" color="#0d9488" />
        
        <Text className="text-teal-600 font-light mt-6">
          Carregando sua plataforma...
        </Text>
      </View>
    </View>
  );
};

export default LoadingScreen; 