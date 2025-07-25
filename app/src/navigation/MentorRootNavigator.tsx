import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MentorTabs from './MentorTabs';

const Stack = createStackNavigator();

const MentorRootNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Tabs" component={MentorTabs} />
  </Stack.Navigator>
);

export default MentorRootNavigator; 