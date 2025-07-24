import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MentoradosScreen from '../screens/Mentor/MentoradosScreen';
import MentoradoDetailScreen from '../screens/Mentor/MentoradoDetailScreen';
import MetaDetailScreen from '../screens/Mentor/MetaDetailScreen';
import MentoradoMetasList from '../screens/Mentor/MentoradoMetasList';

const Stack = createStackNavigator();

const MentoradosStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Mentorados" component={MentoradosScreen} />
    <Stack.Screen name="MentoradoDetail" component={MentoradoDetailScreen} />
    <Stack.Screen name="MentoradoMetasList" component={MentoradoMetasList} />
    <Stack.Screen name="MetaDetail" component={MetaDetailScreen} />
  </Stack.Navigator>
);

export default MentoradosStack; 