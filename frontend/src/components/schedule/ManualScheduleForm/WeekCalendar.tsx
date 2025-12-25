import React from 'react';
import { useManualSchedule, type ScheduleItemAllocation } from '../../../contexts/ManualScheduleContext';
import { useWeekNavigation } from '../../../hooks/schedule/useWeekNavigation';
import { useTimeSlots } from '../../../hooks/schedule/useTimeSlots';
import { Card } from '../../../shared/ui/Card/Card';
import { Icon } from '../../../shared/ui/Icon/Icon';
import { WeekCalendarHeader } from './WeekCalendarHeader';
import { WeekCalendarGrid } from './WeekCalendarGrid';
import type { LessonWithVideoDTO } from '../../../dtos/course/LessonDTO';

interface WeekCalendarProps {
  onLessonClick?: (lesson: LessonWithVideoDTO, allocation: ScheduleItemAllocation) => void;
}

/**
 * Componente principal do calendário semanal
 * Responsabilidade:
 * - Orquestrar subcomponentes (Header, Grid, Footer)
 * - Delegar responsabilidades específicas para subcomponentes
 */
export const WeekCalendar: React.FC<WeekCalendarProps> = ({ onLessonClick }) => {
  const { state } = useManualSchedule();

  const {
    weekDays,
    canGoPrevious,
    canGoNext,
    navigatePreviousWeek,
    navigateNextWeek,
  } = useWeekNavigation({
    startDate: state.startDate,
    endDate: state.endDate,
  });

  const timeSlots = useTimeSlots();

  // Estado vazio: sem datas configuradas
  if (!state.startDate || !state.endDate) {
    return (
      <Card padding="lg">
        <div className="text-center py-12 text-military-gray">
          <Icon name="calendar" size="lg" className="mx-auto mb-3 opacity-50" />
          <p className="font-medium">Configure as datas do cronograma</p>
          <p className="text-sm mt-1">
            Preencha as informações básicas acima para visualizar o calendário
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <WeekCalendarHeader
        firstDay={weekDays[0]}
        lastDay={weekDays[weekDays.length - 1]}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
        onPrevious={navigatePreviousWeek}
        onNext={navigateNextWeek}
      />

      <WeekCalendarGrid
        weekDays={weekDays}
        timeSlots={timeSlots}
        onLessonClick={onLessonClick}
      />
    </Card>
  );
};
