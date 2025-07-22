import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MentorLayout from '../../components/MentorLayout';

const EstatisticasScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('mes');

  const periods = [
    { key: 'semana', label: 'Semana', icon: 'view-week' },
    { key: 'mes', label: 'Mês', icon: 'view-module' },
    { key: 'trimestre', label: 'Trimestre', icon: 'view-agenda' },
    { key: 'ano', label: 'Ano', icon: 'view-list' },
  ];

  const stats = {
    totalMentorados: 12,
    totalMetas: 48,
    taxaConclusao: 89,
    tempoMedio: 2.5,
    satisfacao: 4.8,
  };

  const topMentorados = [
    { nome: 'Maria Silva', progresso: 95, metas: 8, concluidas: 7 },
    { nome: 'Pedro Santos', progresso: 88, metas: 6, concluidas: 5 },
    { nome: 'Ana Costa', progresso: 82, metas: 7, concluidas: 6 },
    { nome: 'João Oliveira', progresso: 78, metas: 5, concluidas: 4 },
  ];

  const categoriasMetas = [
    { categoria: 'Desenvolvimento', quantidade: 15, cor: 'bg-blue-500' },
    { categoria: 'Soft Skills', quantidade: 12, cor: 'bg-green-500' },
    { categoria: 'Liderança', quantidade: 8, cor: 'bg-purple-500' },
    { categoria: 'Dados', quantidade: 6, cor: 'bg-orange-500' },
    { categoria: 'Outros', quantidade: 7, cor: 'bg-gray-500' },
  ];

  const getProgressColor = (progresso: number) => {
    if (progresso >= 90) return 'bg-green-500';
    if (progresso >= 80) return 'bg-blue-500';
    if (progresso >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <MentorLayout activeTab="estatisticas">
      <ScrollView className="flex-1">
        {/* Header with Period Selector */}
        <View className="px-6 py-4 bg-white border-b border-gray-100">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-medium text-slate-900">
              Estatísticas
            </Text>
            <TouchableOpacity className="bg-teal-500 p-3 rounded-full">
              <Icon name="file-download" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Period Selector */}
          <View className="flex-row space-x-2">
            {periods.map((period) => (
              <TouchableOpacity
                key={period.key}
                className={`flex-row items-center px-4 py-2 rounded-xl ${
                  selectedPeriod === period.key 
                    ? 'bg-teal-100 border border-teal-200' 
                    : 'bg-gray-50'
                }`}
                onPress={() => setSelectedPeriod(period.key)}
              >
                <Icon 
                  name={period.icon} 
                  size={16} 
                  color={selectedPeriod === period.key ? '#0f766e' : '#64748b'} 
                />
                <Text 
                  className={`ml-2 text-sm font-medium ${
                    selectedPeriod === period.key ? 'text-teal-700' : 'text-slate-600'
                  }`}
                >
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Main Stats Cards */}
        <View className="px-6 py-4">
          <View className="grid grid-cols-2 gap-4 mb-6">
            <View className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
              <View className="flex-row items-center justify-between mb-2">
                <Icon name="people" size={24} color="#0f766e" />
                <Text className="text-2xl font-bold text-blue-700">
                  {stats.totalMentorados}
                </Text>
              </View>
              <Text className="text-sm text-blue-600 font-medium">Mentorados Ativos</Text>
            </View>

            <View className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
              <View className="flex-row items-center justify-between mb-2">
                <Icon name="flag" size={24} color="#0f766e" />
                <Text className="text-2xl font-bold text-green-700">
                  {stats.totalMetas}
                </Text>
              </View>
              <Text className="text-sm text-green-600 font-medium">Metas Criadas</Text>
            </View>

            <View className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
              <View className="flex-row items-center justify-between mb-2">
                <Icon name="trending-up" size={24} color="#0f766e" />
                <Text className="text-2xl font-bold text-purple-700">
                  {stats.taxaConclusao}%
                </Text>
              </View>
              <Text className="text-sm text-purple-600 font-medium">Taxa de Conclusão</Text>
            </View>

            <View className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
              <View className="flex-row items-center justify-between mb-2">
                <Icon name="schedule" size={24} color="#0f766e" />
                <Text className="text-2xl font-bold text-orange-700">
                  {stats.tempoMedio}
                </Text>
              </View>
              <Text className="text-sm text-orange-600 font-medium">Meses Média</Text>
            </View>
          </View>

          {/* Top Performers */}
          <View className="bg-white p-4 rounded-xl border border-gray-100 mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-medium text-slate-900">
                Top Performers
              </Text>
              <Icon name="emoji-events" size={20} color="#0f766e" />
            </View>
            
            <View className="space-y-3">
              {topMentorados.map((mentorado, index) => (
                <View key={index} className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 bg-teal-100 rounded-full items-center justify-center mr-3">
                      <Text className="text-sm font-bold text-teal-700">
                        {index + 1}
                      </Text>
                    </View>
                    <View>
                      <Text className="font-medium text-slate-900">{mentorado.nome}</Text>
                      <Text className="text-xs text-slate-600">
                        {mentorado.concluidas}/{mentorado.metas} metas concluídas
                      </Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="font-bold text-slate-900">{mentorado.progresso}%</Text>
                    <View className="w-16 h-1 bg-gray-200 rounded-full mt-1">
                      <View 
                        className={`h-1 rounded-full ${getProgressColor(mentorado.progresso)}`}
                        style={{ width: `${mentorado.progresso}%` }}
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Categories Distribution */}
          <View className="bg-white p-4 rounded-xl border border-gray-100 mb-6">
            <Text className="text-lg font-medium text-slate-900 mb-4">
              Distribuição por Categoria
            </Text>
            
            <View className="space-y-3">
              {categoriasMetas.map((categoria, index) => (
                <View key={index} className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className={`w-4 h-4 rounded-full ${categoria.cor} mr-3`} />
                    <Text className="text-slate-900">{categoria.categoria}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="font-medium text-slate-900 mr-2">
                      {categoria.quantidade}
                    </Text>
                    <Text className="text-xs text-slate-500">
                      ({Math.round((categoria.quantidade / categoriasMetas.reduce((acc, cat) => acc + cat.quantidade, 0)) * 100)}%)
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Satisfaction Score */}
          <View className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-xl">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-medium text-slate-900">
                Satisfação Geral
              </Text>
              <Icon name="star" size={20} color="#fbbf24" />
            </View>
            
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-3xl font-bold text-teal-700">
                  {stats.satisfacao}/5.0
                </Text>
                <Text className="text-sm text-slate-600">
                  Baseado em {stats.totalMentorados} avaliações
                </Text>
              </View>
              
              <View className="flex-row">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Icon 
                    key={star}
                    name={star <= Math.floor(stats.satisfacao) ? 'star' : 'star-border'} 
                    size={24} 
                    color={star <= Math.floor(stats.satisfacao) ? '#fbbf24' : '#d1d5db'} 
                  />
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </MentorLayout>
  );
};

export default EstatisticasScreen; 