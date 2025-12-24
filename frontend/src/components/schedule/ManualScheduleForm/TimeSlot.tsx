import React, { useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useManualSchedule } from '../../../contexts/ManualScheduleContext';
import { formatDateObject } from '../../../utils/date/formatDate';
import type { LessonWithVideoDTO } from '../../../dtos/course/LessonDTO';
import type { ScheduleItemAllocation } from '../../../contexts/ManualScheduleContext';

interface TimeSlotProps {
  date: Date;
  timeSlot: string; // HH:mm
  onLessonClick?: (lesson: LessonWithVideoDTO, allocation: ScheduleItemAllocation) => void;
}

/**
 * Componente de slot de tempo no calendário
 * Responsabilidade:
 * - Ser um droppable zone para receber aulas
 * - Exibir aulas já alocadas neste slot
 * - Indicar visualmente quando pode receber um drop
 * - Permitir clique em aulas para edição
 */
export const TimeSlot: React.FC<TimeSlotProps> = ({ date, timeSlot, onLessonClick }) => {
  const { state } = useManualSchedule();

  // Criar ID único para o droppable
  const slotId = useMemo(() => {
    const dateStr = formatDateObject(date, 'yyyy-MM-dd');
    return `${dateStr}-${timeSlot}`;
  }, [date, timeSlot]);

  const { setNodeRef, isOver } = useDroppable({
    id: slotId,
    data: {
      date,
      timeSlot,
    },
  });

  // Encontrar aulas alocadas neste slot
  const allocatedLessons = useMemo(() => {
    const lessons = [];
    const dateStr = formatDateObject(date, 'yyyy-MM-dd');

    for (const [lessonId, allocation] of state.allocations.entries()) {
      const allocationDateStr = formatDateObject(allocation.scheduledDate, 'yyyy-MM-dd');

      if (allocationDateStr === dateStr && allocation.startTime === timeSlot) {
        const lesson = state.selectedLessons.get(lessonId);
        if (lesson) {
          lessons.push({ lesson, allocation });
        }
      }
    }

    return lessons;
  }, [state.allocations, state.selectedLessons, date, timeSlot]);

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-20 p-2 rounded border-2 transition-all
        ${isOver
          ? 'border-military-green bg-green-50 border-dashed'
          : 'border-military-gray bg-white hover:bg-military-khaki-light'
        }
        ${allocatedLessons.length > 0 ? 'bg-blue-50' : ''}
      `}
    >
      {allocatedLessons.length > 0 ? (
        <div className="space-y-1">
          {allocatedLessons.map(({ lesson, allocation }) => (
            <button
              key={lesson.id}
              onClick={() => onLessonClick?.(lesson, allocation)}
              className="w-full text-left text-xs bg-white border border-military-green rounded px-2 py-1 hover:bg-green-50 hover:border-green-400 transition-colors cursor-pointer"
            >
              <div className="font-medium text-military-dark truncate">
                {lesson.title}
              </div>
              <div className="text-military-gray">
                {allocation.duration} min
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center text-xs text-military-gray opacity-0 hover:opacity-100 transition-opacity">
          Arraste uma aula aqui
        </div>
      )}
    </div>
  );
};
