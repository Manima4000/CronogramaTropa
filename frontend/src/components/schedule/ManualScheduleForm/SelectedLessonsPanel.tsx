import React from 'react';
import { useManualSchedule } from '../../../contexts/ManualScheduleContext';
import { Card } from '../../../shared/ui/Card/Card';
import { Badge } from '../../../shared/ui/Badge/Badge';
import { Icon } from '../../../shared/ui/Icon/Icon';
import { Button } from '../../../shared/ui/Button/Button';

export const SelectedLessonsPanel: React.FC = () => {
  const { state, toggleLesson, clearSelectedLessons, getUnallocatedLessons, isLessonAllocated } = useManualSchedule();

  const selectedLessonsArray = Array.from(state.selectedLessons.values());
  const unallocatedLessons = getUnallocatedLessons();
  const allocatedCount = selectedLessonsArray.length - unallocatedLessons.length;

  return (
    <Card padding="lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-military-dark">
          Aulas Selecionadas
        </h3>
        {selectedLessonsArray.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSelectedLessons}
            icon="trash"
          >
            Limpar todas
          </Button>
        )}
      </div>

      <div className="mb-4 flex gap-4">
        <div className="text-sm">
          <span className="font-medium">Total:</span>{' '}
          <Badge variant="info">{selectedLessonsArray.length}</Badge>
        </div>
        <div className="text-sm">
          <span className="font-medium">Alocadas:</span>{' '}
          <Badge variant="success">{allocatedCount}</Badge>
        </div>
        <div className="text-sm">
          <span className="font-medium">Não alocadas:</span>{' '}
          <Badge variant="warning">{unallocatedLessons.length}</Badge>
        </div>
      </div>

      {selectedLessonsArray.length === 0 ? (
        <div className="text-center py-8 text-military-gray">
          <Icon name="inbox" size="lg" className="mx-auto mb-2 opacity-50" />
          <p>Nenhuma aula selecionada</p>
          <p className="text-sm mt-1">Selecione aulas para começar</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {selectedLessonsArray.map(lesson => {
            const allocated = isLessonAllocated(lesson.id);
            const duration = lesson.video?.duration;

            return (
              <div
                key={lesson.id}
                className={`
                  flex items-center gap-3 p-3 rounded border
                  ${allocated ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}
                `}
              >
                <Icon
                  name={allocated ? 'check-circle-fill' : 'clock'}
                  size="md"
                  className={allocated ? 'text-green-600' : 'text-yellow-600'}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-military-dark truncate">
                    {lesson.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {duration ? (
                      <Badge variant="success">{duration} min</Badge>
                    ) : (
                      <Badge variant="default">Sem vídeo</Badge>
                    )}
                    {allocated && (
                      <Badge variant="success">Alocada</Badge>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => toggleLesson(lesson)}
                  className="text-red-600 hover:text-red-800"
                  title="Remover seleção"
                >
                  <Icon name="x-circle" size="md" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {unallocatedLessons.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <div className="flex items-start gap-2">
            <Icon name="exclamation-triangle" size="md" className="text-yellow-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                {unallocatedLessons.length} aula(s) não alocada(s)
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Arraste as aulas para o calendário ou use o botão de alocar
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
