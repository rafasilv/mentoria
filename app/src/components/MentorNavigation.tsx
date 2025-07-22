import React, { useState } from 'react';
import { View, Text } from 'react-native';
import MentorLayout from './MentorLayout';
import MentorDashboardScreen from '../screens/Mentor/DashboardScreen';
import MentoradosScreen from '../screens/Mentor/MentoradosScreen';
import EstatisticasScreen from '../screens/Mentor/EstatisticasScreen';

// Tela de exemplo para Agenda
const AgendaScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 20, color: '#0f766e' }}>Agenda do Mentor</Text>
    <Text style={{ color: '#64748b', marginTop: 8 }}>Aqui você verá seus compromissos, reuniões e eventos.</Text>
  </View>
);

const MentorNavigation = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
  };

  const handleNotifications = () => {
    console.log('Abrir notificações');
  };

  const handleProfile = () => {
    console.log('Abrir perfil');
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MentorDashboardScreen />;
      case 'agenda':
        return <AgendaScreen />;
      case 'mentorados':
        return <MentoradosScreen />;
      case 'estatisticas':
        return <EstatisticasScreen />;
      default:
        return <MentorDashboardScreen />;
    }
  };

  return (
    <MentorLayout
      activeTab={activeTab}
      onTabPress={handleTabPress}
      onNotifications={handleNotifications}
      onProfile={handleProfile}
    >
      {renderScreen()}
    </MentorLayout>
  );
};

export default MentorNavigation; 