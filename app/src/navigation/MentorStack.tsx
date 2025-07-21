import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MentorDashboardScreen from '../screens/Mentor/DashboardScreen';
import ExampleScreen from '../screens/ExampleScreen';

const Stack = createStackNavigator();

const MentorStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={MentorDashboardScreen} />
      <Stack.Screen name="Example" component={ExampleScreen} />
    </Stack.Navigator>
  );
};

export default MentorStack; 