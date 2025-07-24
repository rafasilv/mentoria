import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import MentoradoMetasList from './MentoradoMetasList';
import MetaDetailScreen from './MetaDetailScreen';

const Stack = createStackNavigator();

const MentoradoMetasStack = ({ route }) => {
  // Repassa os params do mentorado/metas para a lista
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MentoradoMetasList" component={MentoradoMetasList} initialParams={route?.params} />
        <Stack.Screen name="MetaDetail" component={MetaDetailScreen} />
      </Stack.Navigator>
    </View>
  );
};

export default MentoradoMetasStack; 