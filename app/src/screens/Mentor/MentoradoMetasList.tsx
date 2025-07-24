import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import NovaMetaForm from './NovaMetaForm';

interface Meta {
  id: number;
  titulo: string;
  descricao: string;
  dataConclusao: Date;
}
interface Mentorado {
  id: number;
  nome: string;
  email: string;
  status: string;
  avatar: string;
  curso: string;
  periodo: string;
}
interface MentoradoMetasParams {
  mentorado: Mentorado;
  metas: Meta[];
}

type StackParamList = {
  MentoradoMetasList: MentoradoMetasParams;
  MetaDetail: { meta: Meta; mentorado: Mentorado };
};

const MentoradoMetasList = () => {
  const navigation = useNavigation<StackNavigationProp<StackParamList>>();
  const route = useRoute<RouteProp<StackParamList, 'MentoradoMetasList'>>();
  const { mentorado, metas: metasProp } = route.params || {};
  const [metas, setMetas] = useState<Meta[]>(metasProp || [
    { id: 1, titulo: 'Estudar para prova de Anatomia', descricao: 'Revisar capítulos 1 a 5 até dia 10/06.', dataConclusao: new Date() },
    { id: 2, titulo: 'Participar de grupo de estudos', descricao: 'Entrar no grupo de estudos de Clínica Médica.', dataConclusao: new Date() },
  ]);
  const [modalVisible, setModalVisible] = useState(false);

  const adicionarMeta = (meta: { titulo: string; descricao: string; dataConclusao: Date }) => {
    setMetas([
      ...metas,
      { id: Date.now(), ...meta },
    ]);
    setModalVisible(false);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: 'white', minHeight: '100%' }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-lg font-semibold text-slate-900">Metas</Text>
        </View>
        {metas.length === 0 && (
          <Text className="text-slate-500 text-center mt-8">Nenhuma meta cadastrada.</Text>
        )}
        {metas.map((meta: Meta) => {
          const data = meta.dataConclusao ? new Date(meta.dataConclusao) : null;
          const hoje = new Date();
          if (data) {
            data.setHours(0,0,0,0);
            hoje.setHours(0,0,0,0);
          }
          const atrasada = data && data <= hoje;
          return (
            <TouchableOpacity
              key={meta.id}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('MetaDetail', { meta, mentorado })}
            >
              <View className="bg-gray-50 p-4 rounded-xl mb-3 border border-gray-100" style={{ position: 'relative', paddingRight: 90 }}>
                {data && (
                  <View
                    className={`flex-row items-center`}
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      backgroundColor: atrasada ? '#fef3c7' : '#f3f4f6',
                      borderRadius: 8,
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      minHeight: 22,
                    }}
                  >
                    {atrasada && (
                      <Icon name="error-outline" size={12} color="#f59e42" style={{ marginRight: 2 }} />
                    )}
                    <Text style={{ fontSize: 11, color: atrasada ? '#b45309' : '#64748b', fontWeight: '500' }}>
                      Até {data.toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                )}
                <Text className="text-base font-medium text-slate-900 mb-1">{meta.titulo}</Text>
                <Text className="text-sm text-slate-600 mb-1">{meta.descricao}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {/* Botão flutuante Nova Meta */}
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
      {/* Overlay do formulário de nova meta */}
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
    </View>
  );
};

export default MentoradoMetasList; 