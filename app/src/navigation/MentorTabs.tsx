import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FeedScreen from '../screens/Mentor/FeedScreen';
import MentoradosStack from '../navigation/MentoradosStack';
import EstatisticasScreen from '../screens/Mentor/EstatisticasScreen';
import { View, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MentorLayout from '../components/MentorLayout';
import { useNavigation } from '@react-navigation/native';
import EditarPerfilScreen from '../screens/Mentor/EditarPerfilScreen';
import TrocarSenhaScreen from '../screens/Mentor/TrocarSenhaScreen';



const Tab = createBottomTabNavigator();

const MentorTabs = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleProfile = () => {
    navigation.navigate('PerfilMentor');
  };

  return (
    <MentorLayout hideFooter onProfile={handleProfile}>
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
              case 'Feed':
                iconName = 'rss-feed';
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
        <Tab.Screen name="Feed" component={FeedScreen} />
        <Tab.Screen name="Mentorados" component={MentoradosStack} />
        <Tab.Screen name="Estatísticas" component={EstatisticasScreen} />
        <Tab.Screen
          name="EditarPerfil"
          component={EditarPerfilScreen}
          options={{
            tabBarButton: () => null,
            tabBarStyle: { display: 'none' }, // Esconde a barra quando estiver nessa tela
          }}
        />
        <Tab.Screen
          name="TrocarSenha"
          component={TrocarSenhaScreen}
          options={{
            tabBarButton: () => null,
            tabBarStyle: { display: 'none' },
          }}
        />
      </Tab.Navigator>
    </MentorLayout>
  );
};

export default MentorTabs; 