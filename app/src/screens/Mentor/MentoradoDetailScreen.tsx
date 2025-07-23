import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Pressable, Platform, useWindowDimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import NovaMetaForm from './NovaMetaForm';
import MentoradoMetasStack from './MentoradoMetasStack';

// Mock para metas com dataConclusao
const metasMock = [
  { id: 1, titulo: 'Estudar para prova de Anatomia', descricao: 'Revisar capítulos 1 a 5 até dia 10/06.', dataConclusao: new Date() },
  { id: 2, titulo: 'Participar de grupo de estudos', descricao: 'Entrar no grupo de estudos de Clínica Médica.', dataConclusao: new Date() },
];

// Definir tipo para mentorado
interface Mentorado {
  id: number;
  nome: string;
  email: string;
  status: string;
  avatar: string;
  curso: string;
  periodo: string;
}

// Definir tipo para os parâmetros da rota
interface MentoradoDetailParams {
  mentorado: Mentorado;
}

// Novo componente para detalhe da meta
const MetaDetail = ({ meta, onBack }: { meta: any; onBack: () => void }) => {
  return (
    <View className="px-6 py-6">
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={onBack} className="mr-3 p-2">
          <Icon name="arrow-back" size={24} color="#0f766e" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-900">Detalhe da Meta</Text>
      </View>
      <View className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-4">
        <Text className="text-lg font-bold text-slate-900 mb-2">{meta.titulo}</Text>
        <Text className="text-base text-slate-600 mb-4">{meta.descricao}</Text>
        {meta.dataConclusao && (
          <View className="flex-row items-center mb-2">
            <Icon name="event" size={18} color="#64748b" style={{ marginRight: 6 }} />
            <Text className="text-sm text-slate-700">Concluir até: {new Date(meta.dataConclusao).toLocaleDateString('pt-BR')}</Text>
          </View>
        )}
        {/* Espaço para planos relacionados no futuro */}
      </View>
    </View>
  );
};

const MentoradoDetailScreen = () => {
  const route = useRoute<RouteProp<Record<string, MentoradoDetailParams>, string>>();
  const mentorado = (route.params as MentoradoDetailParams)?.mentorado;
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [metas, setMetas] = useState(metasMock);
  const [modalVisible, setModalVisible] = useState(false);
  const [novaMeta, setNovaMeta] = useState({ titulo: '', descricao: '' });
  const [tab, setTab] = useState<'info' | 'planosMetas'>('info');
  const { width } = useWindowDimensions();
  const [metaSelecionada, setMetaSelecionada] = useState<any>(null);

  // Mock para outros detalhes e performance
  const [outrosDetalhes, setOutrosDetalhes] = useState('Mentorado dedicado, participa ativamente das reuniões.');
  // Mock de performance
  const metasCriadas = metas.length;
  const metasConcluidas = 2; // Exemplo
  const metasEmAndamento = metasCriadas - metasConcluidas;
  const aderenciaPlanos = 85; // % mockada
  const metasAtingidas = metasCriadas > 0 ? Math.round((metasConcluidas / metasCriadas) * 100) : 0;

  const adicionarMeta = (meta: { titulo: string; descricao: string; dataConclusao: Date }) => {
    setMetas([
      ...metas,
      { id: Date.now(), ...meta },
    ]);
    setModalVisible(false);
  };

  if (!mentorado) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Mentorado não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ backgroundColor: 'white', flex: 1 }} className="flex-1">
        {/* Header com botão de voltar e nome do mentorado */}
        <View className="px-6 pt-8 pb-2 flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 p-2">
            <Icon name="arrow-back" size={24} color="#0f766e" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-slate-900">{mentorado.nome}</Text>
        </View>

        {/* Abas */}
        <View className="flex-row px-6 mb-4 mt-2">
          <Pressable onPress={() => setTab('info')} className={`flex-1 items-center py-2 rounded-xl ${tab === 'info' ? 'bg-teal-100' : ''}`}>
            <Text className={`font-medium ${tab === 'info' ? 'text-teal-700' : 'text-slate-600'}`}>Informações</Text>
          </Pressable>
          <Pressable onPress={() => setTab('planosMetas')} className={`flex-1 items-center py-2 rounded-xl ${tab === 'planosMetas' ? 'bg-teal-100' : ''}`}>
            <Text className={`font-medium ${tab === 'planosMetas' ? 'text-teal-700' : 'text-slate-600'}`}>Metas em andamento</Text>
          </Pressable>
          <Pressable onPress={() => setTab('planosMetas')} className={`flex-1 items-center py-2 rounded-xl ${tab === 'planosMetas' ? 'bg-teal-100' : ''}`}>
            <Text className={`font-medium ${tab === 'planosMetas' ? 'text-teal-700' : 'text-slate-600'}`}>Metas em andamento</Text>
          </Pressable>
          <Pressable onPress={() => setTab('planosMetas')} className={`flex-1 items-center py-2 rounded-xl ${tab === 'planosMetas' ? 'bg-teal-100' : ''}`}>
            <Text className={`font-medium ${tab === 'planosMetas' ? 'text-teal-700' : 'text-slate-600'}`}>Metas em andamento</Text>
          </Pressable>
          <Pressable onPress={() => setTab('planosMetas')} className={`flex-1 items-center py-2 rounded-xl ${tab === 'planosMetas' ? 'bg-teal-100' : ''}`}>
            <Text className={`font-medium ${tab === 'planosMetas' ? 'text-teal-700' : 'text-slate-600'}`}>Metas em andamento</Text>
          </Pressable>
        </View>

        {/* Conteúdo das abas */}
        {tab === 'info' && (
          <View className="px-6 pt-2 pb-4">
            <View className="items-center mb-4">
              <View className="w-20 h-20 bg-teal-100 rounded-full items-center justify-center mb-3">
                <Text className="text-4xl">{mentorado.avatar}</Text>
              </View>
              <Text className="text-2xl font-bold text-slate-900 mb-1">{mentorado.nome}</Text>
              <Text className="text-base text-slate-600 mb-1">{mentorado.email}</Text>
              <Text className="text-sm text-slate-500 mb-1">
                Formação: {mentorado.periodo.includes('Médico') ? 'Médico' : 'Estudante de Medicina'}
              </Text>
            </View>
            {/* Removido outros detalhes e curso/periodo */}
            <View className="mb-2">
              
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                {/* Metas em andamento */}
                <View
                  style={{
                    width: '100%',
                    maxWidth: 420,
                    backgroundColor: '#f8fafc', // cinza claro igual ao card de meta
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 0,
                    borderWidth: 1,
                    borderColor: '#e5e7eb',
                    alignItems: 'center',
                    flexDirection: 'row',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                  className="mb-2"
                >
                  <Icon name="flag" size={22} color="#64748b" style={{ marginRight: 14 }} />
                  <View>
                    <Text className="text-xs text-slate-500 mb-1">Metas em andamento</Text>
                    <Text className="text-lg font-bold text-slate-900">{metasEmAndamento}</Text>
                  </View>
                </View>
                {/* Metas atingidas */}
                <View
                  style={{
                    width: '100%',
                    maxWidth: 420,
                    backgroundColor: '#f8fafc',
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 0,
                    borderWidth: 1,
                    borderColor: '#e5e7eb',
                    alignItems: 'center',
                    flexDirection: 'row',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                  className="mb-2"
                >
                  <Icon name="check-circle" size={22} color="#059669" style={{ marginRight: 14 }} />
                  <View>
                    <Text className="text-xs text-slate-500 mb-1">Metas Atingidas</Text>
                    <View className="flex-row items-center">
                      <Text className="text-lg font-bold text-slate-900 mr-2">{metasAtingidas}%</Text>
                      <View className="w-16 h-1 bg-gray-200 rounded-full">
                        <View style={{ width: `${metasAtingidas}%` }} className="h-1 bg-green-500 rounded-full" />
                      </View>
                    </View>
                  </View>
                </View>
                {/* Aderência aos planos */}
                <View
                  style={{
                    width: '100%',
                    maxWidth: 420,
                    backgroundColor: '#f8fafc',
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 0,
                    borderWidth: 1,
                    borderColor: '#e5e7eb',
                    alignItems: 'center',
                    flexDirection: 'row',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                  className="mb-2"
                >
                  <Icon name="trending-up" size={22} color="#0f766e" style={{ marginRight: 14 }} />
                  <View>
                    <Text className="text-xs text-slate-500 mb-1">Aderência aos planos</Text>
                    <View className="flex-row items-center">
                      <Text className="text-lg font-bold text-slate-900 mr-2">{aderenciaPlanos}%</Text>
                      <View className="w-16 h-1 bg-gray-200 rounded-full">
                        <View style={{ width: `${aderenciaPlanos}%` }} className="h-1 bg-teal-500 rounded-full" />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
        {tab === 'planosMetas' && (
          <View style={{ flex: 1, minHeight: 300 }}>
            <MentoradoMetasStack route={{ params: { mentorado, metas } }} />
          </View>
        )}
      </ScrollView>
      {/* Overlay customizado para adicionar nova meta */}
      {modalVisible && (
        <View style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, zIndex: 10 }} className="flex-1 justify-center items-center bg-black/30">
          <View className="bg-white p-6 rounded-xl w-11/12 max-w-md">
            <Text className="text-lg font-semibold mb-3">Nova Meta</Text>
            <NovaMetaForm
              onSalvar={adicionarMeta}
              onCancelar={() => setModalVisible(false)}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default MentoradoDetailScreen; 