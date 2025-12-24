import React from 'react';
import { Button } from '../../../shared/ui/Button/Button';
import { formatDateRange } from '../../../utils/date/formatDate';

interface WeekCalendarHeaderProps {
  firstDay: Date;
  lastDay: Date;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

/**
 * Cabeçalho do calendário semanal com navegação
 * Responsabilidade: Exibir título e controles de navegação
 */
export const WeekCalendarHeader: React.FC<WeekCalendarHeaderProps> = ({
  firstDay,
  lastDay,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-military-dark">
        Calendário Semanal
      </h2>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          icon="chevron-left"
        >
          Anterior
        </Button>

        <span className="text-sm font-medium text-military-dark px-4">
          {formatDateRange(firstDay, lastDay)}
        </span>

        <Button
          variant="ghost"
          size="sm"
          onClick={onNext}
          disabled={!canGoNext}
          icon="chevron-right"
        >
          Próxima
        </Button>
      </div>
    </div>
  );
};
