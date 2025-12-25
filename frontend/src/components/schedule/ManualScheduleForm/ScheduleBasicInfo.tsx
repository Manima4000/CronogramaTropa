import React from 'react';
import { useManualSchedule } from '../../../contexts/ManualScheduleContext';
import { Input } from '../../../shared/ui/Input/Input';
import { Card } from '../../../shared/ui/Card/Card';
import { parseLocalDate, formatDateForInput, isValidDate } from '../../../utils/date/dateHelpers';

export const ScheduleBasicInfo: React.FC = () => {
  const { state, setBasicInfo, cleanOrphanedAllocations } = useManualSchedule();

  const handleInputChange = (field: string, value: string | number | Date) => {
    setBasicInfo({ [field]: value } as any);
  };

  const handleDateChange = (field: 'startDate' | 'endDate', dateString: string) => {
    if (!dateString) return;

    const newDate = parseLocalDate(dateString);

    // Verificar se é uma data válida
    if (!isValidDate(newDate)) {
      return;
    }

    // Validar range de datas
    if (field === 'endDate' && state.startDate) {
      if (newDate < state.startDate) {
        return; // Não permitir data de fim antes da data de início
      }
    }

    if (field === 'startDate' && state.endDate) {
      if (newDate > state.endDate) {
        return; // Não permitir data de início depois da data de fim
      }
    }

    // Aplicar a mudança de data
    setBasicInfo({ [field]: newDate } as any);

    // Limpar alocações órfãs após mudança de data
    // Aguardar próximo tick para garantir que o state foi atualizado
    setTimeout(() => {
      cleanOrphanedAllocations();
    }, 0);
  };

  return (
    <Card padding="lg">
      <h2 className="text-2xl font-bold text-military-dark mb-6">
        Informações Básicas
      </h2>

      <div className="space-y-4">
        {/* Título */}
        <Input
          label="Título do Cronograma *"
          placeholder="Ex: Cronograma de Estudos - Angular e React"
          value={state.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          fullWidth
        />

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-military-dark mb-1">
            Descrição
          </label>
          <textarea
            value={state.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            placeholder="Descrição opcional do cronograma"
            className="px-4 py-2 rounded border border-military-gray w-full focus:outline-none focus:ring-2 focus:ring-military-green"
          />
        </div>

        {/* Datas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="date"
            label="Data de Início *"
            value={state.startDate ? formatDateForInput(state.startDate) : ''}
            onChange={(e) => handleDateChange('startDate', e.target.value)}
            fullWidth
          />

          <Input
            type="date"
            label="Data de Término *"
            value={state.endDate ? formatDateForInput(state.endDate) : ''}
            onChange={(e) => handleDateChange('endDate', e.target.value)}
            min={state.startDate ? formatDateForInput(state.startDate) : undefined}
            fullWidth
            disabled={!state.startDate}
          />
        </div>
      </div>
    </Card>
  );
};
