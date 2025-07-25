import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Modal, Pressable, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MentorLayout from '../../components/MentorLayout';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { IMaskInput } from 'react-imask';

// Definir tipo para mentorado
interface Mentorado {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  status: string;
  avatar: string;
  curso: string;
  periodo: string;
}

type MentorStackParamList = {
  Mentorados: undefined;
  MentoradoDetail: { mentorado: Mentorado };
};

const MentoradosScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<StackNavigationProp<MentorStackParamList>>();

  // Estado do modal de cadastro
  const [modalVisible, setModalVisible] = useState(false);
  const [novoMentorado, setNovoMentorado] = useState({ nome: '', email: '', telefone: '' });
  const paises = [
    { code: '+55', label: '🇧🇷 Brasil', mask: '(00) 00000-0000' },
    { code: '+1', label: '🇺🇸 EUA', mask: '(000) 000-0000' },
    { code: '+351', label: '🇵🇹 Portugal', mask: '000 000 000' },
  ];
  const [pais, setPais] = useState(paises[0]);
  const [telefoneValido, setTelefoneValido] = useState(true);

  // Ref para foco automático
  const nomeInputRef = useRef<any>(null);

  // Fechar modal com ESC no web
  useEffect(() => {
    if (Platform.OS === 'web' && modalVisible) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setModalVisible(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [modalVisible]);

  // Foco automático no campo nome
  useEffect(() => {
    if (Platform.OS === 'web' && modalVisible && nomeInputRef.current) {
      nomeInputRef.current.focus();
    }
  }, [modalVisible]);

  const camposPreenchidos = novoMentorado.nome && novoMentorado.email && novoMentorado.telefone;

  const [mentorados, setMentorados] = useState([
    {
      id: 1,
      nome: 'Maria Silva',
      email: 'maria@email.com',
      telefone: '',
      status: 'ativo',
      avatar: '👩‍⚕️',
      curso: 'Medicina',
      periodo: '8º período',
    },
    {
      id: 2,
      nome: 'Pedro Santos',
      email: 'pedro@email.com',
      telefone: '',
      status: 'ativo',
      avatar: '👨‍⚕️',
      curso: 'Medicina',
      periodo: '6º período',
    },
    {
      id: 3,
      nome: 'Ana Costa',
      email: 'ana@email.com',
      telefone: '',
      status: 'inativo',
      avatar: '👩‍🎓',
      curso: 'Medicina',
      periodo: '10º período',
    },
    {
      id: 4,
      nome: 'João Oliveira',
      email: 'joao@email.com',
      telefone: '',
      status: 'ativo',
      avatar: '👨‍🎓',
      curso: 'Medicina',
      periodo: '7º período',
    },
  ]);

  // Validação de telefone brasileiro
  function validarTelefoneBR(telefone: string) {
    // Aceita (99) 99999-9999 ou (99) 9999-9999
    return /^\(?\d{2}\)? ?9?\d{4}-?\d{4}$/.test(telefone.replace(/[^\d]/g, ''));
  }

  const filteredMentorados = mentorados.filter(mentorado =>
    mentorado.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    return status === 'ativo' ? 'text-green-600' : 'text-orange-600';
  };

  return (
    <>
      {/* Modal para web */}
      {Platform.OS === 'web' && modalVisible && (
        // @ts-ignore
        <div className="fixed inset-0 z-30 flex justify-center items-center bg-black/30">
          {/* @ts-ignore */}
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col items-stretch p-10" style={{ minWidth: 320, maxHeight: '90vh', overflowY: 'auto' }}>
            <Text className="text-xl font-bold text-center mb-6 text-slate-900">Novo Mentorado</Text>
            <View className="mb-4">
              <Text className="text-base font-medium mb-1 text-slate-700">Nome completo *</Text>
              <TextInput
                className="border border-gray-200 rounded-lg px-3 py-2 text-slate-900"
                placeholder="Digite o nome completo"
                value={novoMentorado.nome}
                onChangeText={text => setNovoMentorado({ ...novoMentorado, nome: text })}
              />
            </View>
            <View className="mb-4">
              <Text className="text-base font-medium mb-1 text-slate-700">Email *</Text>
              <TextInput
                className="border border-gray-200 rounded-lg px-3 py-2 text-slate-900"
                placeholder="Digite o email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={novoMentorado.email}
                onChangeText={text => setNovoMentorado({ ...novoMentorado, email: text })}
              />
            </View>
            <View className="mb-6">
              <Text className="text-base font-medium mb-1 text-slate-700">Telefone *</Text>
              <View className="flex-row items-center space-x-2 mb-2">
                <select
                  className="border border-gray-200 rounded-lg px-2 py-2 text-slate-900 bg-white"
                  value={pais.code}
                  onChange={e => {
                    const p = paises.find(p => p.code === e.target.value);
                    if (p) setPais(p);
                  }}
                  style={{ minWidth: 80 }}
                >
                  {paises.map(p => (
                    <option key={p.code} value={p.code}>{p.label} {p.code}</option>
                  ))}
                </select>
                <IMaskInput
                  mask={pais.mask}
                  value={novoMentorado.telefone}
                  onAccept={(value: string) => {
                    setNovoMentorado({ ...novoMentorado, telefone: value });
                    setTelefoneValido(validarTelefoneBR(value));
                  }}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-slate-900 w-full"
                  placeholder="Digite o telefone"
                  style={{ minWidth: 160 }}
                  unmask={false}
                />
              </View>
              {!telefoneValido && (
                <Text className="text-red-500 text-xs mt-1">Telefone inválido</Text>
              )}
            </View>
            <View className="flex-row justify-end space-x-2">
              <TouchableOpacity onPress={() => setModalVisible(false)} className="px-4 py-2 rounded-lg bg-gray-100">
                <Text className="text-slate-700 font-medium">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setMentorados([
                    ...mentorados,
                    {
                      id: Date.now(),
                      nome: novoMentorado.nome,
                      email: novoMentorado.email,
                      telefone: novoMentorado.telefone,
                      status: 'inativo',
                      avatar: '👤',
                      curso: '',
                      periodo: '',
                    },
                  ]);
                  setNovoMentorado({ nome: '', email: '', telefone: '' });
                  setTelefoneValido(true);
                  Alert.alert('Mentorado cadastrado!', 'O mentorado foi cadastrado como inativo. Ele deve validar o e-mail para ativar a conta.');
                }}
                className={`px-4 py-2 rounded-lg ${camposPreenchidos && telefoneValido ? 'bg-teal-600 hover:bg-teal-700' : 'bg-teal-300'} transition-colors`}
                disabled={!(camposPreenchidos && telefoneValido)}
              >
                <Text className="text-white font-medium">Salvar</Text>
              </TouchableOpacity>
            </View>
          </div>
        </div>
      )}
      {/* Modal nativo para mobile */}
      {Platform.OS !== 'web' && (
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={{ flex: 1 }}>
            {/* Overlay escura */}
            <Pressable style={{ position: 'absolute', top: 80, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.18)', zIndex: 1 }} onPress={() => setModalVisible(false)} />
            {/* Modal principal moderno ocupando todo espaço */}
            <View style={{ position: 'absolute', top: 80, left: 0, right: 0, bottom: 0, backgroundColor: 'white', borderTopLeftRadius: 0, borderTopRightRadius: 0, paddingHorizontal: 0, zIndex: 2, overflow: 'hidden' }}>
              {/* Header do modal */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 24, paddingTop: 24, paddingBottom: 12, borderBottomWidth: 1, borderColor: '#e5e7eb', backgroundColor: 'white' }}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={{ padding: 6, borderRadius: 20, backgroundColor: '#f1f5f9', marginRight: 8 }}>
                  <Icon name="arrow-back" size={24} color="#0f766e" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: '700', color: '#0f172a' }}>Novo Mentorado</Text>
              </View>
              {/* Conteúdo do modal */}
              <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
                <Text className="text-slate-700 mb-1 mt-2">Nome completo</Text>
                <TextInput
                  className="border border-gray-200 rounded-xl px-3 py-3 mb-4 text-slate-900 text-base"
                  placeholder="Digite o nome completo"
                  value={novoMentorado.nome}
                  onChangeText={text => setNovoMentorado({ ...novoMentorado, nome: text })}
                />
                <Text className="text-slate-700 mb-1">Email</Text>
                <TextInput
                  className="border border-gray-200 rounded-xl px-3 py-3 mb-4 text-slate-900 text-base"
                  placeholder="Digite o email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={novoMentorado.email}
                  onChangeText={text => setNovoMentorado({ ...novoMentorado, email: text })}
                />
                <Text className="text-slate-700 mb-1">Telefone</Text>
                <TextInput
                  className="border border-gray-200 rounded-xl px-3 py-3 mb-2 text-slate-900 text-base"
                  placeholder="Digite o telefone"
                  keyboardType="phone-pad"
                  value={novoMentorado.telefone}
                  onChangeText={text => {
                    setNovoMentorado({ ...novoMentorado, telefone: text });
                    setTelefoneValido(validarTelefoneBR(text));
                  }}
                  maxLength={15}
                />
                {!telefoneValido && (
                  <Text className="text-red-500 text-xs mb-2">Telefone inválido</Text>
                )}
                <View className="flex-row justify-end space-x-2 mt-6">
                  <TouchableOpacity onPress={() => setModalVisible(false)} className="px-5 py-3 rounded-xl bg-gray-100">
                    <Text className="text-slate-700 font-medium text-base">Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      setMentorados([
                        ...mentorados,
                        {
                          id: Date.now(),
                          nome: novoMentorado.nome,
                          email: novoMentorado.email,
                          telefone: novoMentorado.telefone,
                          status: 'inativo',
                          avatar: '👤',
                          curso: '',
                          periodo: '',
                        },
                      ]);
                      setNovoMentorado({ nome: '', email: '', telefone: '' });
                      setTelefoneValido(true);
                      Alert.alert('Mentorado cadastrado!', 'O mentorado foi cadastrado como inativo. Ele deve validar o e-mail para ativar a conta.');
                    }}
                    className={`px-5 py-3 rounded-xl ${camposPreenchidos && telefoneValido ? 'bg-teal-600' : 'bg-teal-300'}`}
                    disabled={!(camposPreenchidos && telefoneValido)}
                  >
                    <Text className="text-white font-semibold text-base">Salvar</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
      <ScrollView style={{ backgroundColor: 'white', flex: 1 }} className="flex-1">
        {/* Campo de busca e botão adicionar */}
        <View className="px-6 pt-6 pb-2 bg-white border-b border-gray-100">
          <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 mb-2">
            <Icon name="search" size={20} color="#64748b" />
            <TextInput
              className="flex-1 ml-3 text-slate-900"
              placeholder="Buscar mentorado por nome..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity
              className="ml-3 bg-gray-100 p-2 rounded-full items-center justify-center"
              onPress={() => setModalVisible(true)}
              accessibilityLabel="Adicionar mentorado"
            >
              <Icon name="person-add" size={22} color="#0f766e" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Lista de mentorados em cards */}
        <View className="px-6 py-4 space-y-4">
          {filteredMentorados.length === 0 && (
            <Text className="text-center text-slate-500 mt-8">Nenhum mentorado encontrado.</Text>
          )}
          {filteredMentorados.map((mentorado) => (
            <TouchableOpacity
              key={mentorado.id}
              className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex-row items-center"
              onPress={() => navigation.navigate('MentoradoDetail', { mentorado })}
            >
              <View className="w-14 h-14 bg-teal-100 rounded-full items-center justify-center mr-4">
                <Text className="text-2xl">{mentorado.avatar}</Text>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-lg font-medium text-slate-900">
                    {mentorado.nome}
                  </Text>
                  <View className={`px-2 py-1 rounded-full ${mentorado.status === 'ativo' ? 'bg-green-100' : 'bg-orange-100'}`}> 
                    <Text className={`text-xs font-medium ${getStatusColor(mentorado.status)}`}>
                      {mentorado.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </Text>
                  </View>
                </View>
                <Text className="text-sm text-slate-600 mb-1">{mentorado.email}</Text>
                {/* Removido curso e período */}
              </View>
              <Icon name="chevron-right" size={24} color="#64748b" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </>
  );
};

export default MentoradosScreen; 