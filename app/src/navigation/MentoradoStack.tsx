import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreenMentorado from '../screens/Mentor/DashboardScreenMentorado';

const Stack = createStackNavigator();

const MentoradoStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardScreenMentorado} />
    </Stack.Navigator>
  );
};

export default MentoradoStack; 