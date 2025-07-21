import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Layout from '../../components/Layout';

const MentoradoDashboardScreen = () => {
  const stats = [
    { label: 'Metas', value: '5' },
    { label: 'Concluídas', value: '3' },
    { label: 'Em Progresso', value: '2' }
  ];

  const tasks = [
    { title: 'Estudar React Native', status: 'Em Progresso', deadline: '2 dias' },
    { title: 'Praticar TypeScript', status: 'Em Progresso', deadline: '5 dias' },
    { title: 'Revisar Código', status: 'Pendente', deadline: '1 semana' }
  ];

  return (
    <Layout>
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 20 }}
        className="force-scroll"
      >
        {/* Stats Section */}
        <View className="px-6 py-8 border-b-2 border-cyan-100">
          <View className="flex-row justify-between">
            {stats.map((stat, index) => (
              <View key={index} className="items-center">
                <Text className="text-3xl font-light text-cyan-700 mb-1">
                  {stat.value}
                </Text>
                <Text className="text-slate-600 font-light text-sm">
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tasks Section */}
        <View className="px-6 py-8">
          <Text className="text-xl font-light text-slate-900 mb-6">
            Minhas Metas
          </Text>
          
          <View className="space-y-4">
            {tasks.map((task, index) => (
              <View key={index} className="bg-gray-50 p-4 rounded-xl">
                <Text className="text-cyan-700 font-medium mb-1">
                  {task.title}
                </Text>
                <View className="flex-row justify-between items-center">
                  <Text className="text-slate-600 font-light">
                    {task.status}
                  </Text>
                  <Text className="text-sm text-slate-500">
                    Prazo: {task.deadline}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

export default MentoradoDashboardScreen; 