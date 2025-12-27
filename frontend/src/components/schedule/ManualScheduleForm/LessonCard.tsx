import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { LessonWithVideoDTO } from '../../../dtos/course/LessonDTO';
import { Icon } from '../../../shared/ui/Icon/Icon';
import { Badge } from '../../../shared/ui/Badge/Badge';

interface LessonCardProps {
  lesson: LessonWithVideoDTO;
  isAllocated: boolean;
}

/**
 * Componente de card de aula draggable
 * Responsabilidade:
 * - Ser draggable para permitir alocação no calendário
 * - Exibir informações da aula (título, duração)
 * - Indicar visualmente se está alocada ou não
 */
export const LessonCard: React.FC<LessonCardProps> = ({ lesson, isAllocated }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `lesson-${lesson.id}`,
    data: {
      lesson,
    },
    disabled: isAllocated, // Não permitir arrastar se já estiver alocada
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const duration = lesson.video?.duration;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        p-3 rounded border cursor-grab active:cursor-grabbing
        transition-all
        ${isDragging ? 'opacity-0' : ''}
        ${isAllocated
          ? 'bg-green-50 border-green-200 cursor-not-allowed opacity-70'
          : 'bg-white border-military-gray hover:border-military-green hover:shadow-md'
        }
      `}
    >
      <div className="flex items-start gap-2">
        <Icon
          name={isAllocated ? 'check-circle-fill' : 'grip-vertical'}
          size="sm"
          className={isAllocated ? 'text-green-600' : 'text-military-gray'}
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

            {isAllocated && (
              <Badge variant="success">Alocada</Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
