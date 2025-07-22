import React from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  TextInput 
} from 'react-native';

const ExampleScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView 
        style={{ backgroundColor: 'white', flex: 1 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        className="force-scroll"
      >
        {/* Clean Header */}
        <View className="px-6 py-8 border-b-2 border-teal-100 bg-teal-50">
          <Text className="text-3xl font-light text-slate-900 mb-2">
            Design System
          </Text>
          <Text className="text-teal-600 font-light">
            Exemplos de componentes com NativeWind
          </Text>
        </View>

        {/* Colors Section */}
        <View className="px-6 py-8">
          <Text className="text-2xl font-light text-slate-900 mb-6">
            Cores da Marca
          </Text>
          
          <View className="space-y-4">
            <View className="flex-row space-x-4">
              <View className="flex-1 bg-teal-500 h-20 rounded-xl items-center justify-center">
                <Text className="text-white font-medium">Teal 500</Text>
              </View>
              <View className="flex-1 bg-cyan-500 h-20 rounded-xl items-center justify-center">
                <Text className="text-white font-medium">Cyan 500</Text>
              </View>
            </View>
            
            <View className="flex-row space-x-4">
              <View className="flex-1 bg-teal-100 h-20 rounded-xl items-center justify-center">
                <Text className="text-teal-700 font-medium">Teal 100</Text>
              </View>
              <View className="flex-1 bg-cyan-100 h-20 rounded-xl items-center justify-center">
                <Text className="text-cyan-700 font-medium">Cyan 100</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Typography Section */}
        <View className="px-6 py-8 border-t-2 border-gray-100">
          <Text className="text-2xl font-light text-slate-900 mb-6">
            Tipografia
          </Text>
          
          <View className="space-y-4">
            <Text className="text-4xl font-light text-slate-900">Heading 1</Text>
            <Text className="text-3xl font-light text-slate-900">Heading 2</Text>
            <Text className="text-2xl font-light text-slate-900">Heading 3</Text>
            <Text className="text-lg text-slate-700">Body Large</Text>
            <Text className="text-base text-slate-700">Body Regular</Text>
            <Text className="text-sm text-slate-600">Body Small</Text>
            <Text className="text-xs text-slate-500">Caption</Text>
          </View>
        </View>

        {/* Buttons Section */}
        <View className="px-6 py-8 border-t-2 border-gray-100">
          <Text className="text-2xl font-light text-slate-900 mb-6">
            Botões
          </Text>
          
          <View className="space-y-4">
            {/* Primary Button - Compatível com Mobile */}
            <TouchableOpacity
              className="bg-teal-600 py-4 rounded-xl items-center active:bg-teal-700 shadow-lg"
            >
              <Text className="text-white font-medium text-lg">
                Botão Primário
              </Text>
            </TouchableOpacity>

            {/* Secondary Button */}
            <TouchableOpacity
              className="border-2 border-teal-600 py-4 rounded-xl items-center active:bg-teal-50"
            >
              <Text className="text-teal-600 font-medium text-lg">
                Botão Secundário
              </Text>
            </TouchableOpacity>

            {/* Outline Button */}
            <TouchableOpacity
              className="border-2 border-gray-300 py-4 rounded-xl items-center active:bg-gray-50"
            >
              <Text className="text-gray-600 font-medium text-lg">
                Botão Outline
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Inputs Section */}
        <View className="px-6 py-8 border-t-2 border-gray-100">
          <Text className="text-2xl font-light text-slate-900 mb-6">
            Inputs
          </Text>
          
          <View className="space-y-6">
            {/* Bordered Input */}
            <View>
              <Text className="text-sm text-slate-600 mb-2">Input com borda</Text>
              <TextInput
                className="border-2 border-gray-200 p-4 rounded-xl text-lg focus:border-teal-500"
                placeholder="Digite algo..."
                placeholderTextColor="#9ca3af"
              />
            </View>

            {/* Underlined Input */}
            <View>
              <Text className="text-sm text-slate-600 mb-2">Input sublinhado</Text>
              <TextInput
                className="border-b-2 border-teal-200 pb-3 text-lg focus:border-teal-500"
                placeholder="Digite algo..."
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>
        </View>

        {/* Cards Section */}
        <View className="px-6 py-8 border-t-2 border-gray-100">
          <Text className="text-2xl font-light text-slate-900 mb-6">
            Cards
          </Text>
          
          <View className="space-y-4">
            {/* Simple Card */}
            <View className="bg-white border-2 border-gray-100 p-6 rounded-xl shadow-sm">
              <Text className="text-lg font-medium text-slate-900 mb-2">
                Card Simples
              </Text>
              <Text className="text-slate-600">
                Este é um exemplo de card com bordas suaves e sombra leve.
              </Text>
            </View>

            {/* Colored Card */}
            <View className="bg-teal-50 border-2 border-teal-100 p-6 rounded-xl">
              <Text className="text-lg font-medium text-teal-900 mb-2">
                Card Colorido
              </Text>
              <Text className="text-teal-700">
                Card com cores da marca para destacar informações importantes.
              </Text>
            </View>
          </View>
        </View>

        {/* Spacing Section */}
        <View className="px-6 py-8 border-t-2 border-gray-100">
          <Text className="text-2xl font-light text-slate-900 mb-6">
            Espaçamentos
          </Text>
          
          <View className="space-y-4">
            <View className="bg-gray-100 p-2 rounded">
              <Text className="text-sm text-gray-600">Padding 2 (8px)</Text>
            </View>
            <View className="bg-gray-100 p-4 rounded">
              <Text className="text-sm text-gray-600">Padding 4 (16px)</Text>
            </View>
            <View className="bg-gray-100 p-6 rounded">
              <Text className="text-sm text-gray-600">Padding 6 (24px)</Text>
            </View>
            <View className="bg-gray-100 p-8 rounded">
              <Text className="text-sm text-gray-600">Padding 8 (32px)</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExampleScreen; 