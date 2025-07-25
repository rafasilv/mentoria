import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import NovaMetaForm from './NovaMetaForm';

export interface Meta {
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

interface MentoradoMetasListProps {
  mentorado: Mentorado;
  metas: Meta[];
  onMetaPress?: (meta: Meta) => void;
}

const MentoradoMetasList: React.FC<MentoradoMetasListProps> = ({ mentorado, metas, onMetaPress }) => {
  const navigation = useNavigation<StackNavigationProp<StackParamList>>();
  // Remover useRoute
  // const route = useRoute<RouteProp<StackParamList, 'MentoradoMetasList'>>();
  // const { mentorado, metas: metasProp } = route.params || {};
  // Remover o useState das metas
  // const [metas, setMetas] = useState<Meta[]>(metasProp || [
  //   { id: 1, titulo: 'Estudar para prova de Anatomia', descricao: 'Revisar capítulos 1 a 5 até dia 10/06.', dataConclusao: new Date() },
  //   { id: 2, titulo: 'Participar de grupo de estudos', descricao: 'Entrar no grupo de estudos de Clínica Médica.', dataConclusao: new Date() },
  // ]);
  // Remover o useState de modalVisible
  // const [modalVisible, setModalVisible] = useState(false);

  // Remover a função adicionarMeta
  // const adicionarMeta = (meta: { titulo: string; descricao: string; dataConclusao: Date }) => {
  //   setMetas([
  //     ...metas,
  //     { id: Date.now(), ...meta },
  //   ]);
  //   setModalVisible(false);
  // };

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
          // MOCK: quantidade de planos (substitua por meta.planos.length se existir)
          const quantidadePlanos = (meta as any).planos ? (meta as any).planos.length : Math.floor(Math.random() * 4); // 0 a 3 planos
          return (
            <TouchableOpacity
              key={meta.id}
              activeOpacity={0.85}
              onPress={() => onMetaPress ? onMetaPress(meta) : null}
            >
              <View className="bg-gray-50 p-4 rounded-xl mb-3 border border-gray-100" style={{ position: 'relative', paddingRight: 0 }}>
                {/* Badge de número de planos no canto superior direito */}
                <View style={{ position: 'absolute', top: 10, right: 10, backgroundColor: '#e0f2fe', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3, flexDirection: 'row', alignItems: 'center', zIndex: 10 }}>
                  <Icon name="layers" size={13} color="#0ea5e9" style={{ marginRight: 3 }} />
                  <Text style={{ fontSize: 11, color: '#0369a1', fontWeight: '500' }}>{quantidadePlanos} plano{quantidadePlanos === 1 ? '' : 's'}</Text>
                </View>
                <Text className="text-base font-medium text-slate-900 mb-1">{meta.titulo}</Text>
                <Text className="text-sm text-slate-600 mb-1">{meta.descricao}</Text>
                {/* Rodapé do card */}
                <View className="flex-row items-center mt-3 pt-2 border-t border-gray-100">
                  {data && (
                    <View style={{ backgroundColor: atrasada ? '#fef3c7' : '#f3f4f6', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2, minHeight: 22, flexDirection: 'row', alignItems: 'center' }}>
                      {atrasada && <Icon name="error-outline" size={12} color="#f59e42" style={{ marginRight: 2 }} />}
                      <Text style={{ fontSize: 11, color: atrasada ? '#b45309' : '#64748b', fontWeight: '500' }}>
                        Até {data.toLocaleDateString('pt-BR')}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default MentoradoMetasList; 