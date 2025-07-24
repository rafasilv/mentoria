import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, useWindowDimensions, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ptBR } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Picker } from '@react-native-picker/picker';

export interface Plano {
  id: number;
  nome: string;
  descricao: string;
  data: Date;
  tipo?: string;
  dias?: number[];
  horarios?: { hora: number; minuto: number }[];
  diasMes?: number[];
  diasMesWeb?: string[];
  dataMensal?: Date;
}

interface Meta {
  id: number;
  titulo: string;
  descricao: string;
  dataConclusao: Date;
}

interface MetaDetailScreenProps {
  meta: Meta;
  onBack: () => void;
  planos: Plano[];
  onEditPlano?: (plano: Plano) => void;
}

const diasSemana = [
  { label: 'Dom', value: 0 },
  { label: 'Seg', value: 1 },
  { label: 'Ter', value: 2 },
  { label: 'Qua', value: 3 },
  { label: 'Qui', value: 4 },
  { label: 'Sex', value: 5 },
  { label: 'Sáb', value: 6 },
];

const horasValidas = Array.from({ length: 24 }, (_, i) => i);
const minutosValidos = [0, 15, 30, 45];

export const PlanoForm = ({ onSalvar, onCancelar, onExcluir, plano }: { onSalvar: (plano: any) => void; onCancelar: () => void; onExcluir?: () => void; plano?: Plano }) => {
  const [nome, setNome] = useState(plano?.nome || '');
  const [tipo, setTipo] = useState<'unica' | 'multipla'>('unica');
  const [frequencia, setFrequencia] = useState<'semanal' | 'quinzenal' | 'mensal'>('semanal');
  const [dias, setDias] = useState<number[]>(plano?.dias || []);
  const [horarios, setHorarios] = useState<{ hora: number; minuto: number }[]>(plano?.horarios || [{ hora: 8, minuto: 0 }]);
  const [dataUnica, setDataUnica] = useState<Date>(plano?.data || new Date());
  const [quinzenalInicio, setQuinzenalInicio] = useState<'atual' | 'proxima'>('atual');
  const [showMinutePicker, setShowMinutePicker] = useState<{ idx: number; visible: boolean }>({ idx: 0, visible: false });
  const [diasMes, setDiasMes] = useState<number[]>(plano?.diasMes || []); // para mensal
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState<{ idx: number; visible: boolean }>({ idx: 0, visible: false });
  const [dateWeb, setDateWeb] = useState('');
  const [diasMesWeb, setDiasMesWeb] = useState<string[]>(plano?.diasMesWeb || []); // para web multi-date
  const [dataMensal, setDataMensal] = useState<Date | null>(plano?.dataMensal || null);
  const [showDatePickerMensal, setShowDatePickerMensal] = useState(false);

  const toggleDia = (dia: number) => {
    setDias(dias.includes(dia) ? dias.filter(d => d !== dia) : [...dias, dia]);
  };

  const toggleDiaMes = (dia: number) => {
    setDiasMes(diasMes.includes(dia) ? diasMes.filter(d => d !== dia) : [...diasMes, dia]);
  };

  const handleSalvar = () => {
    if (!nome.trim()) return;
    onSalvar({ nome, tipo, frequencia, dias, horarios, dataUnica, quinzenalInicio, diasMes });
  };

  const addHorario = () => setHorarios([...horarios, { hora: 8, minuto: 0 }]);
  const removeHorario = (idx: number) => setHorarios(horarios.filter((_, i) => i !== idx));
  const updateHorario = (idx: number, field: 'hora' | 'minuto', value: number) => {
    setHorarios(horarios.map((h, i) => i === idx ? { ...h, [field]: value } : h));
  };

  // Handler para seleção de data no web
  const handleDateWebChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateWeb(e.target.value);
    if (e.target.value) setDataUnica(new Date(e.target.value + 'T00:00:00'));
  };

  // Handler para seleção de dias do mês no web (multi-date)
  const handleDiasMesWebChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!diasMesWeb.includes(value)) setDiasMesWeb([...diasMesWeb, value]);
  };
  const removeDiaMesWeb = (dia: string) => setDiasMesWeb(diasMesWeb.filter(d => d !== dia));

  return (
    <View className="bg-white p-4 rounded-xl border border-gray-200 mt-4">
      <Text className="text-base font-semibold mb-2">Nome do Plano *</Text>
      <TextInput
        className="border border-gray-200 rounded-lg px-3 py-2 mb-2"
        placeholder="Nome do plano"
        value={nome}
        onChangeText={setNome}
      />
      <Text className="text-base font-semibold mb-2">Tipo de Interação</Text>
      <View className="flex-row mb-2">
        <TouchableOpacity onPress={() => setTipo('unica')} className={`px-3 py-2 rounded-lg mr-2 ${tipo === 'unica' ? 'bg-teal-500' : 'bg-gray-100'}`}>
          <Text className={tipo === 'unica' ? 'text-white' : 'text-slate-700'}>Única</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTipo('multipla')} className={`px-3 py-2 rounded-lg ${tipo === 'multipla' ? 'bg-teal-500' : 'bg-gray-100'}`}>
          <Text className={tipo === 'multipla' ? 'text-white' : 'text-slate-700'}>Múltipla</Text>
        </TouchableOpacity>
      </View>
      {tipo === 'unica' ? (
        <>
          <Text className="text-base font-semibold mb-2">Data para conclusão</Text>
          {Platform.OS === 'web' ? (
            <DatePicker
              selected={dataUnica}
              onChange={date => date && setDataUnica(date)}
              dateFormat="dd/MM/yyyy"
              locale={ptBR}
              minDate={new Date()}
              className="border border-gray-200 rounded-lg px-3 py-2 mb-2 w-full"
              placeholderText="dd/mm/aaaa"
            />
          ) : (
            <TouchableOpacity className="border border-gray-200 rounded-lg px-3 py-2 mb-2" onPress={() => setShowDatePicker(true)}>
              <Text className="text-slate-700">{dataUnica.toLocaleDateString('pt-BR')}</Text>
            </TouchableOpacity>
          )}
          {showDatePicker && (
            <DateTimePicker
              value={dataUnica}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              locale="pt-BR"
              onChange={(_, date) => {
                setShowDatePicker(false);
                if (date) setDataUnica(date);
              }}
            />
          )}
          <Text className="text-base font-semibold mb-2">Horário</Text>
          <View className="flex-row items-center mb-2">
            <Picker
              selectedValue={horarios[0].hora}
              style={{ height: 40, width: 100, marginRight: 8 }}
              onValueChange={value => updateHorario(0, 'hora', value)}
            >
              {horasValidas.map(h => (
                <Picker.Item key={h} label={h.toString().padStart(2, '0')} value={h} />
              ))}
            </Picker>
            <Text className="mx-1">:</Text>
            <Picker
              selectedValue={horarios[0].minuto}
              style={{ height: 40, width: 100 }}
              onValueChange={value => updateHorario(0, 'minuto', value)}
            >
              {minutosValidos.map(m => (
                <Picker.Item key={m} label={m.toString().padStart(2, '0')} value={m} />
              ))}
            </Picker>
          </View>
        </>
      ) : (
        <>
          <Text className="text-base font-semibold mb-2">Frequência</Text>
          <View className="flex-row mb-2">
            <TouchableOpacity onPress={() => setFrequencia('semanal')} className={`px-3 py-2 rounded-lg mr-2 ${frequencia === 'semanal' ? 'bg-teal-500' : 'bg-gray-100'}`}>
              <Text className={frequencia === 'semanal' ? 'text-white' : 'text-slate-700'}>Semanal</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFrequencia('quinzenal')} className={`px-3 py-2 rounded-lg mr-2 ${frequencia === 'quinzenal' ? 'bg-teal-500' : 'bg-gray-100'}`}>
              <Text className={frequencia === 'quinzenal' ? 'text-white' : 'text-slate-700'}>Quinzenal</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFrequencia('mensal')} className={`px-3 py-2 rounded-lg ${frequencia === 'mensal' ? 'bg-teal-500' : 'bg-gray-100'}`}>
              <Text className={frequencia === 'mensal' ? 'text-white' : 'text-slate-700'}>Mensal</Text>
            </TouchableOpacity>
          </View>
          {frequencia === 'quinzenal' && (
            <View className="mb-2 flex-row items-center">
              <Text className="mr-2 text-slate-700">Começar na:</Text>
              <TouchableOpacity onPress={() => setQuinzenalInicio('atual')} className={`px-2 py-1 rounded-lg mr-2 ${quinzenalInicio === 'atual' ? 'bg-teal-500' : 'bg-gray-100'}`}>
                <Text className={quinzenalInicio === 'atual' ? 'text-white' : 'text-slate-700'}>Semana Atual</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setQuinzenalInicio('proxima')} className={`px-2 py-1 rounded-lg ${quinzenalInicio === 'proxima' ? 'bg-teal-500' : 'bg-gray-100'}`}>
                <Text className={quinzenalInicio === 'proxima' ? 'text-white' : 'text-slate-700'}>Próxima Semana</Text>
              </TouchableOpacity>
            </View>
          )}
          {frequencia === 'mensal' ? (
            <>
              <Text className="text-base font-semibold mb-2">Data de início</Text>
              {Platform.OS === 'web' ? (
                <DatePicker
                  selected={dataMensal}
                  onChange={date => setDataMensal(date)}
                  dateFormat="dd/MM/yyyy"
                  locale={ptBR}
                  minDate={new Date()}
                  className="border border-gray-200 rounded-lg px-3 py-2 mb-2 w-full"
                  placeholderText="dd/mm/aaaa"
                />
              ) : (
                <TouchableOpacity className="border border-gray-200 rounded-lg px-3 py-2 mb-2" onPress={() => setShowDatePickerMensal(true)}>
                  <Text className="text-slate-700">{dataMensal ? dataMensal.toLocaleDateString('pt-BR') : 'Escolher data'}</Text>
                </TouchableOpacity>
              )}
              {showDatePickerMensal && (
                <DateTimePicker
                  value={dataMensal || new Date()}
                  mode="date"
                  minimumDate={new Date()}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(_, date) => {
                    setShowDatePickerMensal(false);
                    if (date) setDataMensal(date);
                  }}
                />
              )}
              <Text className="text-xs text-slate-500 mt-1">Será repetido automaticamente a cada 30 dias a partir da data de início.</Text>
            </>
          ) : (
            <>
              <Text className="text-base font-semibold mb-2">Dias da Semana</Text>
              <View className="flex-row flex-wrap mb-2">
                {diasSemana.map(dia => (
                  <TouchableOpacity
                    key={dia.value}
                    onPress={() => toggleDia(dia.value)}
                    className={`px-3 py-2 rounded-lg mr-2 mb-2 ${dias.includes(dia.value) ? 'bg-teal-500' : 'bg-gray-100'}`}
                  >
                    <Text className={dias.includes(dia.value) ? 'text-white' : 'text-slate-700'}>{dia.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
          <Text className="text-base font-semibold mb-2">Horários</Text>
          {horarios.map((h, idx) => (
            <View key={idx} className="flex-row items-center mb-2">
              <Picker
                selectedValue={h.hora}
                style={{ height: 40, width: 100, marginRight: 8 }}
                onValueChange={value => updateHorario(idx, 'hora', value)}
              >
                {horasValidas.map(hh => (
                  <Picker.Item key={hh} label={hh.toString().padStart(2, '0')} value={hh} />
                ))}
              </Picker>
              <Text className="mx-1">:</Text>
              <Picker
                selectedValue={h.minuto}
                style={{ height: 40, width: 100 }}
                onValueChange={value => updateHorario(idx, 'minuto', value)}
              >
                {minutosValidos.map(m => (
                  <Picker.Item key={m} label={m.toString().padStart(2, '0')} value={m} />
                ))}
              </Picker>
              {horarios.length > 1 && (
                <TouchableOpacity onPress={() => removeHorario(idx)} className="ml-2 px-2 py-1 rounded-lg bg-red-100">
                  <Icon name="close" size={16} color="#dc2626" />
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity onPress={addHorario} className="mt-1 mb-2 px-3 py-2 rounded-lg bg-teal-100 items-center">
            <Text className="text-teal-700 font-medium">Adicionar Horário</Text>
          </TouchableOpacity>
        </>
      )}
      {/* Picker de minutos */}
      {showMinutePicker.visible && (
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 50 }} className="bg-white p-4 border-t border-gray-200">
          <Text className="text-base font-semibold mb-2">Escolha os minutos</Text>
          <View className="flex-row">
            {minutosValidos.map(m => (
              <TouchableOpacity key={m} onPress={() => { updateHorario(showMinutePicker.idx, 'minuto', m); setShowMinutePicker({ idx: 0, visible: false }); }} className="px-4 py-2 rounded-lg bg-gray-100 mr-2">
                <Text className="text-slate-700 text-lg">{m.toString().padStart(2, '0')}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={() => setShowMinutePicker({ idx: 0, visible: false })} className="mt-4 px-4 py-2 rounded-lg bg-gray-200 items-center">
            <Text>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}
      <View className="flex-row justify-end space-x-2 mt-2">
        {onExcluir && (
          <TouchableOpacity onPress={onExcluir} className="px-4 py-2 rounded-lg bg-red-100 items-center">
            <Text className="text-red-700 font-medium">Excluir</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onCancelar} className="px-4 py-2 rounded-lg bg-gray-200">
          <Text>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSalvar} className="px-4 py-2 rounded-lg bg-teal-500" disabled={!nome.trim()}>
          <Text className="text-white">Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

interface MetaDetailScreenProps {
  meta: Meta;
  onBack: () => void;
  planos: Plano[];
  onEditPlano?: (plano: Plano) => void;
}

const MetaDetailScreen: React.FC<MetaDetailScreenProps> = ({ meta, onBack, planos, onEditPlano }) => {
  const { width } = useWindowDimensions();
  const [editandoPlano, setEditandoPlano] = useState<Plano | null>(null);

  if (!meta) return null;

  return (
    <View className="flex-1" style={{ backgroundColor: 'white', minHeight: '100%' }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 2, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header com botão de voltar */}
        <View className="px-6 pt-8 pb-2 flex-row items-center">
          <TouchableOpacity onPress={onBack} className="mr-3 p-2">
            <Icon name="arrow-back" size={24} color="#0f766e" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-slate-900">Detalhe da Meta</Text>
        </View>
        {/* Detalhes da meta */}
        <View className="bg-gray-50 p-6 rounded-xl border border-gray-100 mx-6 mt-4 mb-6">
          <Text className="text-lg font-bold text-slate-900 mb-2">{meta.titulo}</Text>
          <Text className="text-base text-slate-600 mb-4">{meta.descricao}</Text>
          {meta.dataConclusao && (
            <View className="flex-row items-center mb-2">
              <Icon name="event" size={18} color="#64748b" style={{ marginRight: 6 }} />
              <Text className="text-sm text-slate-700">Concluir até: {new Date(meta.dataConclusao).toLocaleDateString('pt-BR')}</Text>
            </View>
          )}
        </View>
        {/* Planos */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-lg font-semibold text-slate-900">Planos</Text>
          </View>
          {planos.length === 0 && (
            <Text className="text-slate-500 text-center mt-8">Nenhum plano cadastrado.</Text>
          )}
          {planos.map((plano, idx) => (
            <TouchableOpacity key={plano.id} onPress={() => onEditPlano && onEditPlano(plano)}>
              <View className="bg-gray-50 p-4 rounded-xl mb-3 border border-gray-100">
                <Text className="text-base font-medium text-slate-900 mb-1">{plano.nome}</Text>
                <Text className="text-sm text-slate-600 mb-1">{plano.descricao}</Text>
                <Text className="text-xs text-slate-500">Tipo: {plano.tipo || 'N/A'}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {/* Formulário para novo plano */}
          {/* Removido formulário de novo plano */}
          {/* Overlay/modal permanece fora do ScrollView */}
          {(editandoPlano) && (
            <View style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, zIndex: 30 }} className="flex-1 justify-center items-center bg-black/30">
              <View style={{ backgroundColor: 'white', borderRadius: 16, width: '100%', maxWidth: 480, maxHeight: '90%', padding: 0, overflow: 'hidden' }}>
                <ScrollView contentContainerStyle={{ padding: 24 }}>
                  <Text className="text-lg font-semibold mb-3">{editandoPlano ? 'Editar Plano' : 'Novo Plano'}</Text>
                  <PlanoForm
                    plano={editandoPlano}
                    onSalvar={plano => {
                      if (editandoPlano) {
                        onEditPlano?.(plano);
                        setEditandoPlano(null);
                      } else {
                        // This part of the logic needs to be handled by the parent component
                        // For now, it will just close the form if it's a new plan
                        setEditandoPlano(null);
                      }
                    }}
                    onCancelar={() => {
                      setEditandoPlano(null);
                    }}
                    onExcluir={editandoPlano ? () => {
                      onEditPlano?.(editandoPlano);
                      setEditandoPlano(null);
                    } : undefined}
                  />
                </ScrollView>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      {/* Botão flutuante para adicionar plano */}
      {/* Removido botão flutuante de adicionar plano */}
      {/* Modal para novo plano */}
      {/* Removido modal de novo plano */}
      {/* Overlay/modal permanece fora do ScrollView */}
    </View>
  );
};

export default MetaDetailScreen; 