import React, { useState } from 'react';
import { ScheduleForm } from '../../components/schedule/ScheduleForm/ScheduleForm';
import { ManualScheduleForm } from '../../components/schedule/ManualScheduleForm/ManualScheduleForm';
import { ManualScheduleProvider } from '../../contexts/ManualScheduleContext';
import { Card } from '../../shared/ui/Card/Card';
import { Icon } from '../../shared/ui/Icon/Icon';

type ScheduleMode = 'automatic' | 'manual';

/**
 * Página de criação de cronograma
 * Responsabilidade:
 * - Permitir seleção entre modo automático e manual
 * - Renderizar formulário apropriado baseado no modo
 * - Fornecer contexto necessário para modo manual
 */
export const CreateSchedulePage: React.FC = () => {
  const [mode, setMode] = useState<ScheduleMode>('automatic');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-military-dark">
          Criar Novo Cronograma
        </h1>
        <p className="text-military-gray mt-2">
          Escolha o modo de criação e preencha as informações
        </p>
      </div>

      {/* Mode Selector */}
      <Card padding="lg" className="mb-6">
        <h2 className="text-lg font-semibold text-military-dark mb-4">
          Modo de Criação
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Automatic Mode */}
          <button
            onClick={() => setMode('automatic')}
            className={`
              p-6 rounded-lg border-2 text-left transition-all
              ${mode === 'automatic'
                ? 'border-military-green bg-green-50'
                : 'border-military-gray bg-white hover:border-military-green hover:bg-green-50/50'
              }
            `}
          >
            <div className="flex items-start gap-3">
              <Icon
                name="magic"
                size="lg"
                className={mode === 'automatic' ? 'text-military-green' : 'text-military-gray'}
              />
              <div className="flex-1">
                <h3 className="font-semibold text-military-dark mb-1">
                  Automático
                </h3>
                <p className="text-sm text-military-gray">
                  Selecione um curso e o sistema gera automaticamente o cronograma
                  baseado nas suas configurações de estudo.
                </p>
                <ul className="mt-2 text-xs text-military-gray space-y-1">
                  <li>✓ Rápido e simples</li>
                  <li>✓ Distribuição automática</li>
                  <li>✓ Ideal para cursos completos</li>
                </ul>
              </div>
              {mode === 'automatic' && (
                <Icon name="check-circle-fill" size="md" className="text-military-green" />
              )}
            </div>
          </button>

          {/* Manual Mode */}
          <button
            onClick={() => setMode('manual')}
            className={`
              p-6 rounded-lg border-2 text-left transition-all
              ${mode === 'manual'
                ? 'border-military-green bg-green-50'
                : 'border-military-gray bg-white hover:border-military-green hover:bg-green-50/50'
              }
            `}
          >
            <div className="flex items-start gap-3">
              <Icon
                name="pencil-square"
                size="lg"
                className={mode === 'manual' ? 'text-military-green' : 'text-military-gray'}
              />
              <div className="flex-1">
                <h3 className="font-semibold text-military-dark mb-1">
                  Manual
                </h3>
                <p className="text-sm text-military-gray">
                  Selecione aulas específicas de múltiplos cursos e organize manualmente
                  no calendário com drag-and-drop.
                </p>
                <ul className="mt-2 text-xs text-military-gray space-y-1">
                  <li>✓ Controle total</li>
                  <li>✓ Múltiplos cursos</li>
                  <li>✓ Personalização completa</li>
                </ul>
              </div>
              {mode === 'manual' && (
                <Icon name="check-circle-fill" size="md" className="text-military-green" />
              )}
            </div>
          </button>
        </div>
      </Card>

      {/* Form */}
      {mode === 'automatic' ? (
        <ScheduleForm />
      ) : (
        <ManualScheduleProvider>
          <ManualScheduleForm />
        </ManualScheduleProvider>
      )}
    </div>
  );
};
