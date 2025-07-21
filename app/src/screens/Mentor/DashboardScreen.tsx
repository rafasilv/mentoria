import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

const MentorDashboardScreen = ({ navigation }: any) => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  const stats = [
    { label: 'Mentorados', value: '3' },
    { label: 'Metas', value: '12' },
    { label: 'Sucesso', value: '85%' },
  ];

  const actions = [
    { id: 'mentorados', title: 'Mentorados', subtitle: 'Gerenciar progresso' },
    { id: 'metas', title: 'Criar Meta', subtitle: 'Definir objetivos' },
    { id: 'relatorios', title: 'Relatórios', subtitle: 'Analisar dados' },
    { id: 'example', title: 'Exemplos', subtitle: 'Ver componentes' },
  ];

  const activities = [
    { title: 'Meta criada', detail: 'Melhorar comunicação - Maria', time: '2h' },
    { title: 'Meta concluída', detail: 'Estudar React Native - Pedro', time: '1d' },
    { title: 'Reunião realizada', detail: 'Feedback semanal - Maria', time: '2d' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        className="force-scroll"
      >
        {/* Clean Header with Brand Colors */}
        <View className="px-6 py-8 border-b-2 border-teal-100 bg-teal-50">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-2xl font-light text-slate-900">
                Olá, {user?.nome}
              </Text>
              <Text className="text-teal-600 font-light mt-1">
                Mentor
              </Text>
            </View>
            
            <TouchableOpacity
              className="border-2 border-teal-200 px-4 py-2 rounded-xl active:bg-teal-50"
              onPress={handleLogout}
            >
              <Text className="text-teal-700 font-medium">Sair</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Clean Stats with Brand Colors */}
        <View className="px-6 py-8">
          <View className="flex-row justify-between">
            {stats.map((stat, index) => (
              <View key={index} className="items-center">
                <Text className="text-3xl font-light text-teal-700 mb-1">
                  {stat.value}
                </Text>
                <Text className="text-slate-600 font-light text-sm">
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Clean Actions with Brand Colors */}
        <View className="px-6 pb-8">
          <Text className="text-lg font-light text-slate-900 mb-6">
            Ações
          </Text>
          
          <View className="space-y-1">
            {actions.map((action) => (
              <TouchableOpacity 
                key={action.id}
                className="border-b border-teal-100 py-4 active:bg-teal-50"
                onPress={() => {
                  if (action.id === 'example') {
                    navigation.navigate('Example');
                  }
                }}
              >
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-slate-900 font-medium mb-1">
                      {action.title}
                    </Text>
                    <Text className="text-teal-600 font-light text-sm">
                      {action.subtitle}
                    </Text>
                  </View>
                  <Text className="text-teal-500">→</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Clean Activity with Brand Colors */}
        <View className="px-6">
          <Text className="text-lg font-light text-slate-900 mb-6">
            Atividade Recente
          </Text>
          
          <View className="space-y-1">
            {activities.map((activity, index) => (
              <View key={index} className="border-b border-teal-100 py-4">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="text-slate-900 font-medium mb-1">
                      {activity.title}
                    </Text>
                    <Text className="text-teal-600 font-light text-sm">
                      {activity.detail}
                    </Text>
                  </View>
                  <Text className="text-slate-500 font-light text-sm">
                    {activity.time}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MentorDashboardScreen; 