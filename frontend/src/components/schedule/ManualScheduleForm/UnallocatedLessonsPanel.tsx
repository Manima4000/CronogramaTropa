import React from 'react';
import { useManualSchedule } from '../../../contexts/ManualScheduleContext';
import { Card } from '../../../shared/ui/Card/Card';
import { Icon } from '../../../shared/ui/Icon/Icon';
import { LessonCard } from './LessonCard';

interface UnallocatedLessonsPanelProps {
  isDragging?: boolean;
}

/**
 * Painel de aulas não alocadas
 * Responsabilidade:
 * - Exibir aulas que ainda não foram alocadas no calendário
 * - Permitir drag-and-drop dessas aulas para o calendário
 * - Mostrar feedback visual quando não há aulas não alocadas
 */
export const UnallocatedLessonsPanel: React.FC<UnallocatedLessonsPanelProps> = ({ isDragging = false }) => {
  const { getUnallocatedLessons, isLessonAllocated } = useManualSchedule();
  const unallocatedLessons = getUnallocatedLessons();

  return (
    <Card padding="lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-military-dark">
          Aulas para Alocar
        </h3>
        <div className="flex items-center gap-2 text-sm">
          <Icon name="grip-vertical" size="sm" className="text-military-gray" />
          <span className="text-military-gray">
            Arraste para o calendário
          </span>
        </div>
      </div>

      {unallocatedLessons.length === 0 ? (
        <div className="text-center py-8 text-military-gray">
          <Icon name="check-circle-fill" size="lg" className="mx-auto mb-2 text-green-600 opacity-50" />
          <p className="font-medium text-green-700">Todas as aulas foram alocadas!</p>
          <p className="text-sm mt-1">
            Você pode reorganizar arrastando as aulas no calendário
          </p>
        </div>
      ) : (
        <>
          <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <div className="flex items-start gap-2">
              <Icon name="info-circle" size="sm" className="text-yellow-600 mt-0.5" />
              <p className="text-sm text-yellow-800">
                <strong>{unallocatedLessons.length} aula(s)</strong> aguardando alocação.
                Arraste-as para os horários no calendário abaixo.
              </p>
            </div>
          </div>

          <div className={`space-y-2 max-h-96 ${isDragging ? 'overflow-hidden' : 'overflow-y-auto'}`}>
            {unallocatedLessons.map(lesson => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                isAllocated={isLessonAllocated(lesson.id)}
              />
            ))}
          </div>
        </>
      )}
    </Card>
  );
};
