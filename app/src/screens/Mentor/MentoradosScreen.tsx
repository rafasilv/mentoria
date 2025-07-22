import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MentorLayout from '../../components/MentorLayout';

const MentoradosScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const mentorados = [
    {
      id: 1,
      nome: 'Maria Silva',
      email: 'maria@email.com',
      status: 'ativo',
      avatar: '👩‍⚕️',
      curso: 'Medicina',
      periodo: '8º período',
    },
    {
      id: 2,
      nome: 'Pedro Santos',
      email: 'pedro@email.com',
      status: 'ativo',
      avatar: '👨‍⚕️',
      curso: 'Medicina',
      periodo: '6º período',
    },
    {
      id: 3,
      nome: 'Ana Costa',
      email: 'ana@email.com',
      status: 'inativo',
      avatar: '👩‍🎓',
      curso: 'Medicina',
      periodo: '10º período',
    },
    {
      id: 4,
      nome: 'João Oliveira',
      email: 'joao@email.com',
      status: 'ativo',
      avatar: '👨‍🎓',
      curso: 'Medicina',
      periodo: '7º período',
    },
  ];

  const filteredMentorados = mentorados.filter(mentorado =>
    mentorado.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    return status === 'ativo' ? 'text-green-600' : 'text-orange-600';
  };

  return (
    <ScrollView style={{ backgroundColor: 'white', flex: 1 }} className="flex-1">
      {/* Campo de busca */}
      <View className="px-6 pt-6 pb-2 bg-white border-b border-gray-100">
        <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 mb-2">
          <Icon name="search" size={20} color="#64748b" />
          <TextInput
            className="flex-1 ml-3 text-slate-900"
            placeholder="Buscar mentorado por nome..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Lista de mentorados em cards */}
      <View className="px-6 py-4 space-y-4">
        {filteredMentorados.length === 0 && (
          <Text className="text-center text-slate-500 mt-8">Nenhum mentorado encontrado.</Text>
        )}
        {filteredMentorados.map((mentorado) => (
          <TouchableOpacity
            key={mentorado.id}
            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex-row items-center"
          >
            <View className="w-14 h-14 bg-teal-100 rounded-full items-center justify-center mr-4">
              <Text className="text-2xl">{mentorado.avatar}</Text>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-lg font-medium text-slate-900">
                  {mentorado.nome}
                </Text>
                <View className={`px-2 py-1 rounded-full ${mentorado.status === 'ativo' ? 'bg-green-100' : 'bg-orange-100'}`}> 
                  <Text className={`text-xs font-medium ${getStatusColor(mentorado.status)}`}>
                    {mentorado.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </Text>
                </View>
              </View>
              <Text className="text-sm text-slate-600 mb-1">{mentorado.email}</Text>
              <Text className="text-xs text-slate-500">{mentorado.curso} • {mentorado.periodo}</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#64748b" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default MentoradosScreen; 