import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Pressable, Platform, useWindowDimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import NovaMetaForm from './NovaMetaForm';
import MentoradoMetasList, { Meta } from './MentoradoMetasList';
import SectionDropdown from '../../components/SectionDropdown';
import MetaDetailScreen, { PlanoForm, Plano } from './MetaDetailScreen'; // Corrigida a importação nomeada

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
  const [activeSection, setActiveSection] = useState('info');
  const { width } = useWindowDimensions();
  const [metaSelecionada, setMetaSelecionada] = useState<Meta | null>(null);
  // Estado para controle do modal de novo plano
  const [showPlanoForm, setShowPlanoForm] = useState(false);
  // Estado local para planos (mock)
  const [planos, setPlanos] = useState<Plano[]>([]);
  // Estado para edição de plano
  const [planoEditando, setPlanoEditando] = useState<Plano | null>(null);

  // Definição das seções disponíveis
  const sections = [
    { key: 'info', label: 'Informações', icon: 'person' },
    { key: 'planosMetas', label: 'Planos e Metas', icon: 'flag' },
    { key: 'historico', label: 'Histórico', icon: 'history' },
    { key: 'avaliacoes', label: 'Avaliações', icon: 'star' },
    { key: 'documentos', label: 'Documentos', icon: 'description' },
    { key: 'relatorios', label: 'Relatórios', icon: 'assessment' },
  ];

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
    <View style={{ flex: 1, position: 'relative' }}>
      <ScrollView style={{ backgroundColor: 'white', flex: 1, zIndex: 1 }} className="flex-1">
        {/* Header com botão de voltar e nome do mentorado */}
        <View className="px-6 pt-8 pb-2 flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 p-2">
            <Icon name="arrow-back" size={24} color="#0f766e" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-slate-900">{mentorado.nome}</Text>
        </View>

        {/* Seletor de seções */}
        <View className="px-6 mb-4 mt-2" style={{ zIndex: 9999 }}>
          <SectionDropdown
            sections={sections}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            placeholder="Selecionar seção"
          />
        </View>

        {/* Conteúdo das seções */}
        {activeSection === 'info' && (
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
        {activeSection === 'planosMetas' && (
          metaSelecionada ? (
            <View style={{ flex: 1 }}>
              <MetaDetailScreen
                meta={metaSelecionada}
                onBack={() => setMetaSelecionada(null)}
                planos={planos}
                onEditPlano={plano => {
                  setPlanoEditando(plano);
                  setShowPlanoForm(true);
                }}
              />
            </View>
          ) : (
            <MentoradoMetasList mentorado={mentorado} metas={metas} onMetaPress={setMetaSelecionada} />
          )
        )}

        {activeSection === 'historico' && (
          <View className="px-6 pt-2 pb-4">
            <View className="bg-white rounded-xl p-6 border border-gray-100">
              <Text className="text-lg font-semibold text-slate-900 mb-4">Histórico de Interações</Text>
              <Text className="text-slate-600">Aqui será exibido o histórico completo de interações e atividades do mentorado.</Text>
            </View>
          </View>
        )}

        {activeSection === 'avaliacoes' && (
          <View className="px-6 pt-2 pb-4">
            <View className="bg-white rounded-xl p-6 border border-gray-100">
              <Text className="text-lg font-semibold text-slate-900 mb-4">Avaliações</Text>
              <Text className="text-slate-600">Aqui serão exibidas as avaliações e feedback do mentorado.</Text>
            </View>
          </View>
        )}

        {activeSection === 'documentos' && (
          <View className="px-6 pt-2 pb-4">
            <View className="bg-white rounded-xl p-6 border border-gray-100">
              <Text className="text-lg font-semibold text-slate-900 mb-4">Documentos</Text>
              <Text className="text-slate-600">Aqui serão exibidos os documentos e arquivos relacionados ao mentorado.</Text>
            </View>
          </View>
        )}

        {activeSection === 'relatorios' && (
          <View className="px-6 pt-2 pb-4">
            <View className="bg-white rounded-xl p-6 border border-gray-100">
              <Text className="text-lg font-semibold text-slate-900 mb-4">Relatórios</Text>
              <Text className="text-slate-600">Aqui serão exibidos os relatórios de progresso e performance do mentorado.</Text>
            </View>
          </View>
        )}
      </ScrollView>
      {/* Botão flutuante e modal fora do ScrollView, só aparecem na seção de metas */}
      {activeSection === 'planosMetas' && !metaSelecionada && (
        <>
          <View
            pointerEvents="box-none"
            style={{
              position: 'absolute',
              right: 24,
              bottom: 32,
              zIndex: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={{
                backgroundColor: '#14b8a6',
                borderRadius: 32,
                padding: 16,
                elevation: 4,
                shadowColor: '#000',
                shadowOpacity: 0.12,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 2 },
              }}
              className="items-center justify-center"
            >
              <Icon name="add" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
          {modalVisible && (
            <View style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, zIndex: 30 }} className="flex-1 justify-center items-center bg-black/30">
              <View className="bg-white p-6 rounded-xl w-11/12 max-w-md">
                <Text className="text-lg font-semibold mb-3">Nova Meta</Text>
                <NovaMetaForm
                  onSalvar={adicionarMeta}
                  onCancelar={() => setModalVisible(false)}
                />
              </View>
            </View>
          )}
        </>
      )}
      {/* Botão flutuante para adicionar plano - só aparece no detalhe da meta */}
      {activeSection === 'planosMetas' && metaSelecionada && (
        <View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            right: 24,
            bottom: 32,
            zIndex: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setPlanoEditando(null);
              setShowPlanoForm(true);
            }}
            style={{
              backgroundColor: '#14b8a6',
              borderRadius: 32,
              padding: 16,
              elevation: 4,
              shadowColor: '#000',
              shadowOpacity: 0.12,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
            }}
            className="items-center justify-center"
          >
            <Icon name="add" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
      {/* Modal para novo plano */}
      {(showPlanoForm || planoEditando) && (
        <View style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, zIndex: 30 }} className="flex-1 justify-center items-center bg-black/30">
          <View style={{ backgroundColor: 'white', borderRadius: 16, width: '100%', maxWidth: 480, maxHeight: '90%', padding: 0, overflow: 'hidden' }}>
            <ScrollView contentContainerStyle={{ padding: 24 }}>
              <Text className="text-lg font-semibold mb-3">{planoEditando ? 'Editar Plano' : 'Novo Plano'}</Text>
              <PlanoForm
                plano={planoEditando || undefined}
                onSalvar={(plano: Plano) => {
                  if (planoEditando) {
                    setPlanos(planos.map(p => p.id === planoEditando.id ? { ...planoEditando, ...plano } : p));
                  } else {
                    const { id, ...rest } = plano;
                    setPlanos([...planos, { id: Date.now(), ...rest }]);
                  }
                  setShowPlanoForm(false);
                  setPlanoEditando(null);
                }}
                onCancelar={() => {
                  setShowPlanoForm(false);
                  setPlanoEditando(null);
                }}
                onExcluir={planoEditando ? () => {
                  setPlanos(planos.filter(p => p.id !== planoEditando.id));
                  setShowPlanoForm(false);
                  setPlanoEditando(null);
                } : undefined}
              />
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
};

export default MentoradoDetailScreen; 