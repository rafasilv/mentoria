import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MentorDashboardScreen from '../screens/Mentor/DashboardScreen';
import MentoradosScreen from '../screens/Mentor/MentoradosScreen';
import EstatisticasScreen from '../screens/Mentor/EstatisticasScreen';
import { View, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MentorLayout from '../components/MentorLayout';

// Tela de exemplo para Agenda
const AgendaScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 20, color: '#0f766e' }}>Agenda do Mentor</Text>
    <Text style={{ color: '#64748b', marginTop: 8 }}>Aqui você verá seus compromissos, reuniões e eventos.</Text>
  </View>
);

const Tab = createBottomTabNavigator();

const MentorTabs = () => {
  const insets = useSafeAreaInsets();
  return (
    <MentorLayout hideFooter>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#0f766e',
          tabBarInactiveTintColor: '#64748b',
          tabBarShowLabel: true,
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 0,
            elevation: 10,
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowOffset: { width: 0, height: -2 },
            shadowRadius: 8,
            height: (Platform.OS === 'ios' ? 70 : 60) + insets.bottom,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 6,
            paddingTop: 6,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '400',
            marginTop: 2,
            letterSpacing: 0.2,
          },
          tabBarItemStyle: {
            borderRadius: 18,
            marginHorizontal: 6,
          },
          tabBarIcon: ({ color, size, focused }) => {
            let iconName = '';
            switch (route.name) {
              case 'To-do':
                iconName = 'checklist';
                break;
              case 'Agenda':
                iconName = 'event';
                break;
              case 'Mentorados':
                iconName = 'people';
                break;
              case 'Estatísticas':
                iconName = 'analytics';
                break;
            }
            return (
              <View style={{
                backgroundColor: focused ? '#ccfbf1' : 'transparent',
                borderRadius: 16,
                padding: focused ? 8 : 0,
                shadowColor: focused ? '#0f766e' : 'transparent',
                shadowOpacity: focused ? 0.12 : 0,
                shadowRadius: focused ? 8 : 0,
                shadowOffset: { width: 0, height: 2 },
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Icon name={iconName} size={focused ? 30 : 24} color={color} />
              </View>
            );
          },
        })}
      >
        <Tab.Screen name="To-do" component={MentorDashboardScreen} />
        <Tab.Screen name="Agenda" component={AgendaScreen} />
        <Tab.Screen name="Mentorados" component={MentoradosScreen} />
        <Tab.Screen name="Estatísticas" component={EstatisticasScreen} />
      </Tab.Navigator>
    </MentorLayout>
  );
};

export default MentorTabs; 