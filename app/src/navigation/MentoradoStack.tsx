import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MentoradoDashboardScreen from '../screens/Mentorado/DashboardScreen';

const Stack = createStackNavigator();

const MentoradoStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={MentoradoDashboardScreen} />
    </Stack.Navigator>
  );
};

export default MentoradoStack; 