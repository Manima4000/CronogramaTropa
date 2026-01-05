import React, { useState, useEffect } from 'react';
import type { LessonWithVideoDTO } from '../../../dtos/course/LessonDTO';
import type { ScheduleItemAllocation } from '../../../contexts/ManualScheduleContext';
import { Button } from '../../../shared/ui/Button/Button';
import { Input } from '../../../shared/ui/Input/Input';
import { Icon } from '../../../shared/ui/Icon/Icon';

interface EditAllocationModalProps {
  lesson: LessonWithVideoDTO;
  allocation: ScheduleItemAllocation;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<ScheduleItemAllocation>) => void;
  onDelete: () => void;
}

/**
 * Modal para editar alocação de aula
 * Responsabilidade:
 * - Permitir edição de hora de início e duração
 * - Validar inputs
 * - Exibir informações da aula
 */
export const EditAllocationModal: React.FC<EditAllocationModalProps> = ({
  lesson,
  allocation,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  // Use allocation values as initial state, will reset when component remounts
  const [startTime, setStartTime] = useState(allocation.startTime);
  const [duration, setDuration] = useState(allocation.duration);

  // Reset values when allocation changes (form is reopened with different data)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStartTime(allocation.startTime);
    setDuration(allocation.duration);
  }, [allocation.startTime, allocation.duration, isOpen]);

  const handleSave = () => {
    // Validação básica
    if (!startTime || duration <= 0) {
      return;
    }

    onSave({ startTime, duration });
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja remover esta alocação?')) {
      onDelete();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-military-gray">
          <h3 className="text-xl font-bold text-military-dark">
            Editar Alocação
          </h3>
          <button
            onClick={onClose}
            className="text-military-gray hover:text-military-dark transition-colors"
          >
            <Icon name="x" size="md" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Informações da aula */}
          <div className="bg-military-khaki-light rounded p-4">
            <div className="flex items-start gap-2">
              <Icon name="play-circle" size="sm" className="text-military-green mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-military-dark">{lesson.title}</p>
                {lesson.video?.duration && (
                  <p className="text-sm text-military-gray mt-1">
                    Duração do vídeo: {lesson.video.duration} minutos
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Data agendada */}
          <div>
            <label className="block text-sm font-medium text-military-dark mb-1">
              Data
            </label>
            <Input
              type="text"
              value={allocation.scheduledDate.toLocaleDateString('pt-BR')}
              disabled
              fullWidth
            />
          </div>

          {/* Hora de início */}
          <div>
            <label className="block text-sm font-medium text-military-dark mb-1">
              Hora de Início *
            </label>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              fullWidth
            />
          </div>

          {/* Duração */}
          <div>
            <label className="block text-sm font-medium text-military-dark mb-1">
              Duração (minutos) *
            </label>
            <Input
              type="number"
              min={1}
              max={480}
              value={duration.toString()}
              onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
              fullWidth
            />
            <p className="text-xs text-military-gray mt-1">
              Sugestão: {lesson.video?.duration || 60} minutos
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-military-gray">
          <Button
            variant="danger"
            onClick={handleDelete}
            icon="trash"
          >
            Remover
          </Button>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              icon="check-circle"
            >
              Salvar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
