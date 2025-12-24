import React from 'react';
import { TimeSlot } from './TimeSlot';
import { formatWeekday, formatDateObject } from '../../../utils/date/formatDate';
import type { LessonWithVideoDTO } from '../../../dtos/course/LessonDTO';
import type { ScheduleItemAllocation } from '../../../contexts/ManualScheduleContext';

interface WeekCalendarGridProps {
  weekDays: Date[];
  timeSlots: string[];
  onLessonClick?: (lesson: LessonWithVideoDTO, allocation: ScheduleItemAllocation) => void;
}

/**
 * Grid do calendário semanal
 * Responsabilidade:
 * - Renderizar a grade de dias x horários
 * - Gerenciar o layout responsivo
 * - Delegar a lógica de drag-and-drop e cliques para TimeSlot
 */
export const WeekCalendarGrid: React.FC<WeekCalendarGridProps> = ({ weekDays, timeSlots, onLessonClick }) => {
  const gridColumns = `80px repeat(${weekDays.length}, minmax(150px, 1fr))`;

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max">
        {/* Cabeçalho dos dias */}
        <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: gridColumns }}>
          <div className="text-sm font-medium text-military-gray text-center">
            Horário
          </div>
          {weekDays.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-sm font-semibold text-military-dark capitalize">
                {formatWeekday(day)}
              </div>
              <div className="text-xs text-military-gray">
                {formatDateObject(day, 'dd/MM')}
              </div>
            </div>
          ))}
        </div>

        {/* Slots de tempo */}
        {timeSlots.map((timeSlot) => (
          <div
            key={timeSlot}
            className="grid gap-2 mb-2"
            style={{ gridTemplateColumns: gridColumns }}
          >
            {/* Label do horário */}
            <div className="flex items-center justify-center text-sm font-medium text-military-gray bg-military-khaki-light rounded p-2">
              {timeSlot}
            </div>

            {/* Slots para cada dia */}
            {weekDays.map((day) => (
              <TimeSlot
                key={`${day.toISOString()}-${timeSlot}`}
                date={day}
                timeSlot={timeSlot}
                onLessonClick={onLessonClick}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
