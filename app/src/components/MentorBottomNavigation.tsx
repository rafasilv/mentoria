import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface MentorBottomNavigationProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

const MentorBottomNavigation: React.FC<MentorBottomNavigationProps> = ({
  activeTab,
  onTabPress,
}) => {
  const tabs = [
    {
      key: 'dashboard',
      label: 'To-do',
      icon: 'checklist',
    },
    {
      key: 'agenda',
      label: 'Agenda',
      icon: 'event',
    },
    {
      key: 'mentorados',
      label: 'Mentorados',
      icon: 'people',
    },
    {
      key: 'estatisticas',
      label: 'Estatísticas',
      icon: 'analytics',
    },
  ];

  return (
    <View className="bg-white border-t-2 border-teal-100">
      <View className="flex-row justify-around py-3">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            className="items-center px-2"
            onPress={() => onTabPress(tab.key)}
          >
            <Icon
              name={tab.icon}
              size={24}
              color={activeTab === tab.key ? '#0f766e' : '#64748b'}
            />
            <Text
              className={`text-xs mt-1 font-medium ${
                activeTab === tab.key ? 'text-teal-700' : 'text-slate-500'
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default MentorBottomNavigation; 