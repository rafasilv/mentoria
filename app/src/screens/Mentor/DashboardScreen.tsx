import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Layout from '../../components/Layout';

const MentorDashboardScreen = () => {
  const activities = [
    { title: 'Meta criada', detail: 'Melhorar comunicação - Maria', time: '2h' },
    { title: 'Meta concluída', detail: 'Estudar React Native - Pedro', time: '1d' },
    { title: 'Reunião realizada', detail: 'Feedback semanal - Maria', time: '2d' },
  ];

  return (
    <Layout>
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 20 }}
        className="force-scroll"
      >
        {/* Clean Stats with Brand Colors */}
        <View className="px-6 py-8 border-b-2 border-teal-100">
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-3xl font-light text-teal-700 mb-1">12</Text>
              <Text className="text-slate-600 font-light text-sm">Mentorados</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl font-light text-teal-700 mb-1">48</Text>
              <Text className="text-slate-600 font-light text-sm">Metas</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl font-light text-teal-700 mb-1">89%</Text>
              <Text className="text-slate-600 font-light text-sm">Conclusão</Text>
            </View>
          </View>
        </View>

        {/* Recent Activities */}
        <View className="px-6 py-8">
          <Text className="text-xl font-light text-slate-900 mb-6">
            Atividades Recentes
          </Text>
          
          <View className="space-y-4">
            {activities.map((activity, index) => (
              <View key={index} className="bg-gray-50 p-4 rounded-xl">
                <Text className="text-teal-700 font-medium mb-1">
                  {activity.title}
                </Text>
                <Text className="text-slate-600 font-light mb-2">
                  {activity.detail}
                </Text>
                <Text className="text-sm text-slate-500">
                  há {activity.time}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

export default MentorDashboardScreen; 