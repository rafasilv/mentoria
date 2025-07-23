import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MentorDashboardScreen from '../screens/Mentor/DashboardScreen';
import MentoradosScreen from '../screens/Mentor/MentoradosScreen';
import EstatisticasScreen from '../screens/Mentor/EstatisticasScreen';
import ExampleScreen from '../screens/ExampleScreen';
import MentoradoDetailScreen from '../screens/Mentor/MentoradoDetailScreen';
import MetaDetailScreen from '../screens/Mentor/MetaDetailScreen';

const Stack = createStackNavigator();

const MentorStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={MentorDashboardScreen} />
      <Stack.Screen name="Mentorados" component={MentoradosScreen} />
      <Stack.Screen name="Estatisticas" component={EstatisticasScreen} />
      <Stack.Screen name="Example" component={ExampleScreen} />
      <Stack.Screen name="MentoradoDetail" component={MentoradoDetailScreen} />
      <Stack.Screen name="MetaDetail" component={MetaDetailScreen} />
    </Stack.Navigator>
  );
};

export default MentorStack; 