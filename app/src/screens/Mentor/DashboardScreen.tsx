import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MentorLayout from '../../components/MentorLayout';

const MentorDashboardScreen = () => {
  const metasParaAnalise = [
    { 
      titulo: 'Aprender Procedimentos Cardíacos',
      mentorado: 'Dr. Carlos Mendes',
      diasAtraso: 5,
      status: 'atraso'
    },
    { 
      titulo: 'Estudar Casos Clínicos Pediátricos',
      mentorado: 'Dra. Ana Silva',
      diasAtraso: 2,
      status: 'atraso'
    },
    { 
      titulo: 'Revisar Protocolos de Emergência',
      mentorado: 'Dr. Pedro Santos',
      diasAtraso: 1,
      status: 'atraso'
    },
    { 
      titulo: 'Aprender Interpretação de Exames Neurológicos',
      mentorado: 'Dra. Maria Costa',
      diasAtraso: 0,
      status: 'hoje'
    },
  ];

  // Ordenar por tempo de vencimento (mais atrasadas primeiro)
  const metasOrdenadas = metasParaAnalise.sort((a, b) => {
    if (a.status === 'atraso' && b.status === 'hoje') return -1;
    if (a.status === 'hoje' && b.status === 'atraso') return 1;
    return b.diasAtraso - a.diasAtraso;
  });

  const getCardBgColor = (status: string) =>
    status === 'atraso' ? 'bg-red-50' : 'bg-orange-50';
  const getCardBorderColor = (status: string) =>
    status === 'atraso' ? 'border-red-200' : 'border-orange-200';
  const getStatusBgColor = (status: string) =>
    status === 'atraso' ? 'bg-red-100' : 'bg-orange-100';
  const getStatusTextColor = (status: string) =>
    status === 'atraso' ? 'text-red-700' : 'text-orange-700';

  return (
    <ScrollView 
      style={{ backgroundColor: 'white', flex: 1 }}
      contentContainerStyle={{ paddingBottom: 20 }}
      className="force-scroll"
    >
      {/* Metas para Análise */}
      <View className="px-6 py-6">
        {/* Título removido */}
        <View className="space-y-4">
          {metasOrdenadas.map((meta, index) => (
            <View key={index} className={`${getCardBgColor(meta.status)} p-4 rounded-xl border ${getCardBorderColor(meta.status)} shadow-sm`}>
              <View className="flex-row items-start justify-between mb-3">
                <View className="flex-row items-center flex-1">
                  <Icon 
                    name="flag" 
                    size={24} 
                    color={meta.status === 'atraso' ? '#dc2626' : '#ea580c'} 
                    style={{ marginRight: 12 }}
                  />
                  <View className="flex-1">
                    <Text className={`text-lg font-medium mb-1 ${meta.status === 'atraso' ? 'text-red-700' : 'text-orange-700'}`}>
                      {meta.titulo}
                    </Text>
                    <Text className="text-slate-600 font-medium">
                      {meta.mentorado}
                    </Text>
                  </View>
                </View>
                <View className={`px-3 py-1 rounded-full ${getStatusBgColor(meta.status)}`}>
                  <Text className={`text-xs font-medium ${getStatusTextColor(meta.status)}`}>
                    Meta
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Icon 
                    name="schedule" 
                    size={16} 
                    color={meta.status === 'atraso' ? '#dc2626' : '#ea580c'} 
                  />
                  <Text className={`text-sm font-medium ml-2 ${meta.status === 'atraso' ? 'text-red-600' : 'text-orange-600'}`}>
                    {meta.status === 'atraso' ? `${meta.diasAtraso} dia${meta.diasAtraso > 1 ? 's' : ''} em atraso` : 'Vence hoje'}
                  </Text>
                </View>
                
                <View className="flex-row space-x-2">
                  <View className="p-2 bg-white rounded-full shadow-sm">
                    <Icon name="chat" size={16} color="#64748b" />
                  </View>
                  <View className="p-2 bg-white rounded-full shadow-sm">
                    <Icon name="visibility" size={16} color="#64748b" />
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default MentorDashboardScreen; 