import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
// Certifique-se de instalar: npm install @react-native-community/datetimepicker
import DateTimePicker from '@react-native-community/datetimepicker';

// @ts-ignore
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ptBR from 'date-fns/locale/pt-BR';

interface NovaMetaFormProps {
  onSalvar: (meta: { titulo: string; descricao: string; dataConclusao: Date }) => void;
  onCancelar: () => void;
}

const NovaMetaForm: React.FC<NovaMetaFormProps> = ({ onSalvar, onCancelar }) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataConclusao, setDataConclusao] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleSalvar = () => {
    setTouched(true);
    if (!titulo.trim()) return;
    onSalvar({ titulo, descricao, dataConclusao });
    setTitulo('');
    setDescricao('');
    setDataConclusao(new Date());
    setTouched(false);
  };

  // Função para formatar data no padrão brasileiro
  const formatarDataBR = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  // Ao abrir o form, garantir campos vazios
  useEffect(() => {
    setTitulo('');
    setDescricao('');
    setDataConclusao(new Date());
  }, [onCancelar]);

  return (
    <View>
      <Text className="text-base font-semibold mb-2">Título *</Text>
      <TextInput
        className="border border-gray-200 rounded-lg px-3 py-2 mb-2"
        placeholder="Nome da meta"
        value={titulo}
        onChangeText={setTitulo}
        onBlur={() => setTouched(true)}
      />
      {touched && !titulo.trim() && (
        <Text className="text-red-500 text-xs mb-2">O nome da meta é obrigatório.</Text>
      )}
      <Text className="text-base font-semibold mb-2">Descrição</Text>
      <TextInput
        className="border border-gray-200 rounded-lg px-3 py-2 mb-2"
        placeholder="Descrição da meta (opcional)"
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />
      <Text className="text-base font-semibold mb-2">Data para conclusão</Text>
      {Platform.OS === 'web' ? (
        <div style={{ marginBottom: 16 }}>
          <DatePicker
            selected={dataConclusao}
            onChange={(date: Date) => setDataConclusao(date)}
            dateFormat="dd/MM/yyyy"
            locale={ptBR}
            className="border border-gray-200 rounded-lg px-3 py-2 w-full"
            placeholderText="dd/mm/aaaa"
            minDate={new Date()}
          />
        </div>
      ) : (
        <>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} className="border border-gray-200 rounded-lg px-3 py-2 mb-4">
            <Text className="text-slate-700">{formatarDataBR(dataConclusao)}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dataConclusao}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event: any, date?: Date) => {
                setShowDatePicker(false);
                if (date) setDataConclusao(date);
              }}
            />
          )}
        </>
      )}
      <View className="flex-row justify-end space-x-2 mt-2">
        <TouchableOpacity onPress={onCancelar} className="px-4 py-2 rounded-lg bg-gray-200">
          <Text>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSalvar} className="px-4 py-2 rounded-lg bg-teal-500" disabled={!titulo.trim()}>
          <Text className="text-white">Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NovaMetaForm; 