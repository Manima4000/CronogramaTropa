import React from 'react';
import { Icon } from '../../../shared/ui/Icon/Icon';

interface WeekCalendarFooterProps {
  studyDaysPerWeek: number;
  hoursPerDay: number;
}

/**
 * Footer do calendário com informações resumidas
 * Responsabilidade: Exibir metadados do cronograma
 */
export const WeekCalendarFooter: React.FC<WeekCalendarFooterProps> = ({
  studyDaysPerWeek,
  hoursPerDay,
}) => {
  return (
    <div className="mt-6 flex items-center gap-4 text-sm text-military-gray border-t border-military-gray pt-4">
      <div className="flex items-center gap-2">
        <Icon name="calendar-check" size="sm" />
        <span>{studyDaysPerWeek} dias por semana</span>
      </div>
      <div className="flex items-center gap-2">
        <Icon name="clock" size="sm" />
        <span>{hoursPerDay} horas por dia</span>
      </div>
    </div>
  );
};
