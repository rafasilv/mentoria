const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Adicionar suporte para web e SVG
config.resolver.platforms = ['ios', 'android', 'native', 'web'];
config.resolver.assetExts.push('svg');

module.exports = withNativeWind(config, { input: './global.css' }); 