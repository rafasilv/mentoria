import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MentoradoMetasList from './MentoradoMetasList';
import MetaDetailScreen from './MetaDetailScreen';

const Stack = createStackNavigator();

const MentoradoMetasStack = ({ route }) => {
  // Repassa os params do mentorado/metas para a lista
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MentoradoMetasList" component={MentoradoMetasList} initialParams={route?.params} />
      <Stack.Screen name="MetaDetail" component={MetaDetailScreen} />
    </Stack.Navigator>
  );
};

export default MentoradoMetasStack; 