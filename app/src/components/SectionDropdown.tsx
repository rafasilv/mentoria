import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Section {
  key: string;
  label: string;
  icon: string;
}

interface SectionDropdownProps {
  sections: Section[];
  activeSection: string;
  onSectionChange: (section: string) => void;
  placeholder?: string;
}

const SectionDropdown: React.FC<SectionDropdownProps> = ({
  sections,
  activeSection,
  onSectionChange,
  placeholder = 'Selecionar seção'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<View>(null);

  const activeSectionData = sections.find(section => section.key === activeSection);

  const handleSectionSelect = (sectionKey: string) => {
    onSectionChange(sectionKey);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <View className="relative" style={{ zIndex: Platform.OS === 'web' ? 9999 : undefined }}>
      {/* Botão do dropdown */}
      <TouchableOpacity
        ref={dropdownRef}
        onPress={toggleDropdown}
        className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex-row items-center justify-between"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
        }}
      >
        <View className="flex-row items-center flex-1">
          {activeSectionData && (
            <>
              <Icon name={activeSectionData.icon} size={20} color="#0f766e" style={{ marginRight: 8 }} />
              <Text className="text-slate-900 font-medium flex-1">{activeSectionData.label}</Text>
            </>
          )}
          {!activeSectionData && (
            <Text className="text-slate-500 flex-1">{placeholder}</Text>
          )}
        </View>
        <Icon 
          name={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
          size={24} 
          color="#64748b" 
        />
      </TouchableOpacity>

      {/* Modal para mobile */}
      {Platform.OS !== 'web' && (
        <Modal
          visible={isOpen}
          transparent
          animationType="fade"
          onRequestClose={closeDropdown}
        >
          <Pressable 
            style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onPress={closeDropdown}
          >
            <View className="flex-1 justify-end">
              <View className="bg-white rounded-t-3xl p-6 max-h-96">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-lg font-semibold text-slate-900">Seções</Text>
                  <TouchableOpacity onPress={closeDropdown}>
                    <Icon name="close" size={24} color="#64748b" />
                  </TouchableOpacity>
                </View>
                <View className="max-h-80">
                  {sections.map((section) => (
                    <TouchableOpacity
                      key={section.key}
                      onPress={() => handleSectionSelect(section.key)}
                      className={`flex-row items-center py-3 px-2 rounded-lg mb-2 ${
                        activeSection === section.key ? 'bg-teal-50' : ''
                      }`}
                    >
                      <Icon 
                        name={section.icon} 
                        size={20} 
                        color={activeSection === section.key ? '#0f766e' : '#64748b'} 
                        style={{ marginRight: 12 }} 
                      />
                      <Text className={`font-medium ${
                        activeSection === section.key ? 'text-teal-700' : 'text-slate-700'
                      }`}>
                        {section.label}
                      </Text>
                      {activeSection === section.key && (
                        <Icon name="check" size={20} color="#0f766e" style={{ marginLeft: 'auto' }} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </Pressable>
        </Modal>
      )}

      {/* Dropdown para web */}
      {Platform.OS === 'web' && isOpen && (
        <View className="absolute top-full left-0 right-0 z-[9999] mt-1 bg-white border border-gray-200 rounded-xl shadow-lg">
          {sections.map((section) => (
            <TouchableOpacity
              key={section.key}
              onPress={() => handleSectionSelect(section.key)}
              className={`flex-row items-center py-3 px-4 hover:bg-gray-50 ${
                activeSection === section.key ? 'bg-teal-50' : ''
              } ${section.key === sections[0].key ? 'rounded-t-xl' : ''} ${
                section.key === sections[sections.length - 1].key ? 'rounded-b-xl' : ''
              }`}
            >
              <Icon 
                name={section.icon} 
                size={20} 
                color={activeSection === section.key ? '#0f766e' : '#64748b'} 
                style={{ marginRight: 12 }} 
              />
              <Text className={`font-medium ${
                activeSection === section.key ? 'text-teal-700' : 'text-slate-700'
              }`}>
                {section.label}
              </Text>
              {activeSection === section.key && (
                <Icon name="check" size={20} color="#0f766e" style={{ marginLeft: 'auto' }} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Overlay para fechar dropdown no web */}
      {Platform.OS === 'web' && isOpen && (
        <Pressable
          style={{
            position: 'absolute' as any,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9998,
          }}
          onPress={closeDropdown}
        />
      )}
    </View>
  );
};

export default SectionDropdown; 