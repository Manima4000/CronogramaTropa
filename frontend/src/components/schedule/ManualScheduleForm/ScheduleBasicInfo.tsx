import React from 'react';
import { useManualSchedule } from '../../../contexts/ManualScheduleContext';
import { Input } from '../../../shared/ui/Input/Input';
import { Card } from '../../../shared/ui/Card/Card';

export const ScheduleBasicInfo: React.FC = () => {
  const { state, setBasicInfo } = useManualSchedule();

  const handleInputChange = (field: string, value: string | number | Date) => {
    setBasicInfo({ [field]: value } as any);
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
            value={state.startDate ? state.startDate.toISOString().split('T')[0] : ''}
            onChange={(e) => handleInputChange('startDate', new Date(e.target.value))}
            fullWidth
          />

          <Input
            type="date"
            label="Data de Término *"
            value={state.endDate ? state.endDate.toISOString().split('T')[0] : ''}
            onChange={(e) => handleInputChange('endDate', new Date(e.target.value))}
            fullWidth
          />
        </div>

        <h3 className="text-xl font-semibold text-military-dark mt-6 mb-4">
          Configuração de Estudo
        </h3>

        {/* Dias por semana e horas por dia */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="number"
            label="Dias de Estudo por Semana *"
            min={1}
            max={7}
            value={state.studyDaysPerWeek.toString()}
            onChange={(e) => handleInputChange('studyDaysPerWeek', parseInt(e.target.value) || 1)}
            fullWidth
          />

          <Input
            type="number"
            label="Horas por Dia *"
            min={1}
            max={24}
            value={state.hoursPerDay.toString()}
            onChange={(e) => handleInputChange('hoursPerDay', parseInt(e.target.value) || 1)}
            fullWidth
          />
        </div>
      </div>
    </Card>
  );
};
