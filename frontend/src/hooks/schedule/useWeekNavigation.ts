import { useState, useMemo, useCallback, useEffect } from 'react';
import { normalizeDate } from '../../utils/date/dateHelpers';

interface UseWeekNavigationProps {
  startDate: Date | null;
  endDate: Date | null;
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
 * Sempre mostra semanas completas (7 dias)
 * Respeita os limites de startDate e endDate
 */
export const useWeekNavigation = ({
  startDate,
  endDate,
}: UseWeekNavigationProps): UseWeekNavigationReturn => {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    return startDate ? normalizeDate(startDate) : normalizeDate(new Date());
  });

  // Atualizar currentWeekStart quando startDate mudar
  useEffect(() => {
    if (startDate) {
      setCurrentWeekStart(normalizeDate(startDate));
    }
  }, [startDate]);

  // Calcular os dias da semana atual (sempre 7 dias)
  const weekDays = useMemo(() => {
    const days: Date[] = [];
    const start = normalizeDate(currentWeekStart);
    const normalizedStartDate = startDate ? normalizeDate(startDate) : null;
    const normalizedEndDate = endDate ? normalizeDate(endDate) : null;

    // Sempre gerar 7 dias
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      const normalizedDay = normalizeDate(day);

      // Verificar se está dentro do range do cronograma
      if (normalizedStartDate && normalizedEndDate) {
        if (normalizedDay >= normalizedStartDate && normalizedDay <= normalizedEndDate) {
          days.push(normalizedDay);
        }
      } else {
        days.push(normalizedDay);
      }
    }

    return days;
  }, [currentWeekStart, startDate, endDate]);

  const canGoPrevious = useMemo(() => {
    if (!startDate) return true;
    const normalizedCurrent = normalizeDate(currentWeekStart);
    const normalizedStart = normalizeDate(startDate);
    return normalizedCurrent > normalizedStart;
  }, [currentWeekStart, startDate]);

  const canGoNext = useMemo(() => {
    if (!endDate) return true;
    const nextWeekStart = new Date(currentWeekStart);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);
    const normalizedNext = normalizeDate(nextWeekStart);
    const normalizedEnd = normalizeDate(endDate);
    return normalizedNext <= normalizedEnd;
  }, [currentWeekStart, endDate]);

  const navigatePreviousWeek = useCallback(() => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() - 7);
    const normalizedNewStart = normalizeDate(newStart);

    // Não permitir navegar antes da data de início
    if (startDate) {
      const normalizedStartDate = normalizeDate(startDate);
      if (normalizedNewStart < normalizedStartDate) {
        setCurrentWeekStart(normalizedStartDate);
      } else {
        setCurrentWeekStart(normalizedNewStart);
      }
    } else {
      setCurrentWeekStart(normalizedNewStart);
    }
  }, [currentWeekStart, startDate]);

  const navigateNextWeek = useCallback(() => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + 7);
    const normalizedNewStart = normalizeDate(newStart);

    // Não permitir navegar além da data de término
    if (endDate) {
      const normalizedEndDate = normalizeDate(endDate);
      if (normalizedNewStart > normalizedEndDate) {
        return; // Já estamos na última semana
      }
    }

    setCurrentWeekStart(normalizedNewStart);
  }, [currentWeekStart, endDate]);

  return {
    currentWeekStart,
    weekDays,
    canGoPrevious,
    canGoNext,
    navigatePreviousWeek,
    navigateNextWeek,
  };
};
