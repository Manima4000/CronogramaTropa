import { useState, useMemo, useCallback } from 'react';

interface UseWeekNavigationProps {
  startDate: Date | null;
  endDate: Date | null;
  studyDaysPerWeek: number;
}

interface UseWeekNavigationReturn {
  currentWeekStart: Date;
  weekDays: Date[];
  canGoPrevious: boolean;
  canGoNext: boolean;
  navigatePreviousWeek: () => void;
  navigateNextWeek: () => void;
}

/**
 * Hook para gerenciar navegação semanal no calendário
 * Respeita os limites de startDate e endDate
 */
export const useWeekNavigation = ({
  startDate,
  endDate,
  studyDaysPerWeek,
}: UseWeekNavigationProps): UseWeekNavigationReturn => {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    return startDate || new Date();
  });

  // Calcular os dias da semana atual baseado em studyDaysPerWeek
  const weekDays = useMemo(() => {
    const days: Date[] = [];
    const start = new Date(currentWeekStart);

    for (let i = 0; i < studyDaysPerWeek && i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);

      // Verificar se está dentro do range do cronograma
      if (startDate && endDate) {
        if (day >= startDate && day <= endDate) {
          days.push(day);
        }
      } else {
        days.push(day);
      }
    }

    return days;
  }, [currentWeekStart, studyDaysPerWeek, startDate, endDate]);

  const canGoPrevious = useMemo(() => {
    if (!startDate) return true;
    return currentWeekStart > startDate;
  }, [currentWeekStart, startDate]);

  const canGoNext = useMemo(() => {
    if (!endDate) return true;
    const nextWeekStart = new Date(currentWeekStart);
    nextWeekStart.setDate(nextWeekStart.getDate() + studyDaysPerWeek);
    return nextWeekStart <= endDate;
  }, [currentWeekStart, endDate, studyDaysPerWeek]);

  const navigatePreviousWeek = useCallback(() => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() - studyDaysPerWeek);

    // Não permitir navegar antes da data de início
    if (startDate && newStart < startDate) {
      setCurrentWeekStart(new Date(startDate));
    } else {
      setCurrentWeekStart(newStart);
    }
  }, [currentWeekStart, studyDaysPerWeek, startDate]);

  const navigateNextWeek = useCallback(() => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + studyDaysPerWeek);

    // Não permitir navegar além da data de término
    if (endDate && newStart > endDate) {
      return; // Já estamos na última semana
    }

    setCurrentWeekStart(newStart);
  }, [currentWeekStart, studyDaysPerWeek, endDate]);

  return {
    currentWeekStart,
    weekDays,
    canGoPrevious,
    canGoNext,
    navigatePreviousWeek,
    navigateNextWeek,
  };
};
