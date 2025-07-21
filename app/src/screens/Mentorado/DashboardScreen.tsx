import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

const MentoradoDashboardScreen = () => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  const stats = [
    { label: 'Metas', value: '3' },
    { label: 'Progresso', value: '73%' },
    { label: 'Concluídas', value: '1' },
  ];

  const todayTasks = [
    { title: 'Estudar React Navigation', time: '2h', completed: false },
    { title: 'Reunião com Mentor', time: '15:00', completed: false },
    { title: 'Praticar Coding', time: '1h', completed: true },
  ];

  const goals = [
    { title: 'Estudar React Native', progress: 75, category: 'Tecnologia' },
    { title: 'Melhorar Comunicação', progress: 45, category: 'Soft Skills' },
    { title: 'Aprender TypeScript', progress: 100, category: 'Tecnologia' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        className="force-scroll"
      >
        {/* Clean Header with Brand Colors */}
        <View className="px-6 py-8 border-b-2 border-cyan-100 bg-cyan-50">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-2xl font-light text-slate-900">
                Olá, {user?.nome}
              </Text>
              <Text className="text-cyan-600 font-light mt-1">
                Mentorado
              </Text>
            </View>
            
            <TouchableOpacity
              className="border-2 border-cyan-200 px-4 py-2 rounded-xl active:bg-cyan-50"
              onPress={handleLogout}
            >
              <Text className="text-cyan-700 font-medium">Sair</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Clean Stats with Brand Colors */}
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

        {/* Today's Tasks with Brand Colors */}
        <View className="px-6 py-8 border-b-2 border-cyan-100">
          <Text className="text-lg font-light text-slate-900 mb-6">
            Hoje
          </Text>
          
          <View className="space-y-1">
            {todayTasks.map((task, index) => (
              <TouchableOpacity 
                key={index}
                className="border-b border-cyan-100 py-4 active:bg-cyan-50"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className={`font-medium mb-1 ${
                      task.completed ? 'text-slate-400 line-through' : 'text-slate-900'
                    }`}>
                      {task.title}
                    </Text>
                    <Text className="text-cyan-600 font-light text-sm">
                      {task.time}
                    </Text>
                  </View>
                  <View className={`w-5 h-5 rounded-full border-2 ${
                    task.completed 
                      ? 'bg-teal-600 border-teal-600' 
                      : 'border-cyan-300'
                  }`}>
                    {task.completed && (
                      <Text className="text-white text-xs text-center">✓</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Goals with Brand Colors */}
        <View className="px-6 py-8">
          <Text className="text-lg font-light text-slate-900 mb-6">
            Metas
          </Text>
          
          <View className="space-y-6">
            {goals.map((goal, index) => (
              <TouchableOpacity 
                key={index}
                className="active:bg-cyan-50 py-2"
              >
                <View className="mb-3">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-slate-900 font-medium">
                      {goal.title}
                    </Text>
                    <Text className="text-cyan-600 font-medium text-sm">
                      {goal.progress}%
                    </Text>
                  </View>
                  <Text className="text-cyan-600 font-light text-sm mb-3">
                    {goal.category}
                  </Text>
                  
                  <View className="h-2 bg-cyan-100 rounded-full overflow-hidden">
                    <View 
                      className={`h-full rounded-full ${
                        goal.progress === 100 
                          ? 'bg-teal-500' 
                          : 'bg-cyan-400'
                      }`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MentoradoDashboardScreen; 