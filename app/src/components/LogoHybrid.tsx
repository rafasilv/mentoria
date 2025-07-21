import React from 'react';
import { View, Platform, Image } from 'react-native';
import LogoSVG from './LogoSVG';

interface LogoHybridProps {
  width?: number;
  height?: number;
  className?: string;
}

// Import do asset SVG para Expo
const logoAsset = require('../../assets/logo.svg');

const LogoHybrid: React.FC<LogoHybridProps> = ({ 
  width = 134, 
  height = 60, 
  className = '' 
}) => {
  if (Platform.OS === 'web') {
    // Na WEB: usar Image com source do asset SVG
    return (
      <View 
        className={className}
        style={{ 
          width: width, 
          height: height,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Image
          source={logoAsset}
          style={{
            width: width,
            height: height
          }}
          resizeMode="contain"
        />
      </View>
    );
  }

  // No MOBILE: usar LogoSVG.tsx (React Native SVG - melhor qualidade)
  return (
    <LogoSVG 
      width={width} 
      height={height} 
      className={className} 
    />
  );
};

export default LogoHybrid; 