import React from 'react';
import { ManualScheduleForm } from '../../components/schedule/ManualScheduleForm/ManualScheduleForm';
import { ManualScheduleProvider } from '../../contexts/ManualScheduleContext';

/**
 * Página de criação de cronograma manual
 * Responsabilidade:
 * - Renderizar formulário de criação manual
 * - Fornecer contexto necessário para o formulário
 */
export const CreateSchedulePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-military-dark">
          Criar Novo Cronograma
        </h1>
        <p className="text-military-gray mt-2">
          Selecione aulas e organize seu cronograma de estudos
        </p>
      </div>

      {/* Form */}
      <ManualScheduleProvider>
        <ManualScheduleForm />
      </ManualScheduleProvider>
    </div>
  );
};
