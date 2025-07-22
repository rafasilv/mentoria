import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import AuthStack from './AuthStack';
import MentorTabs from './MentorTabs';
import MentoradoStack from './MentoradoStack';
import LoadingScreen from '../screens/LoadingScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : user.tipo_usuario === 'MENTOR' ? (
        <Stack.Screen name="Mentor" component={MentorTabs} />
      ) : (
        <Stack.Screen name="Mentorado" component={MentoradoStack} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator; 