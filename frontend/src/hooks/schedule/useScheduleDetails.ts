import { useState, useEffect, useCallback } from 'react';
import type { ScheduleWithDetailsDTO } from '../../dtos/schedule/ScheduleWithItemsDTO';
import { scheduleService } from '../../services';
import type { ApiErrorDTO } from '../../dtos/common/ApiErrorDTO';

interface UseScheduleDetailsReturn {
  schedule: ScheduleWithDetailsDTO | null;
  loading: boolean;
  error: ApiErrorDTO | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para buscar detalhes completos de um cronograma
 * Responsabilidade:
 * - Buscar schedule com items e lessons do backend
 * - Gerenciar estado de loading e error
 * - Fornecer função refetch para recarregar dados
 *
 * @param scheduleId - ID do cronograma a ser buscado
 */
export const useScheduleDetails = (scheduleId: number): UseScheduleDetailsReturn => {
  const [schedule, setSchedule] = useState<ScheduleWithDetailsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiErrorDTO | null>(null);

  const fetchSchedule = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await scheduleService.getById(scheduleId);
      // O backend agora retorna ScheduleWithDetailsDTO (com lesson nos items)
      setSchedule(result as unknown as ScheduleWithDetailsDTO);
    } catch (err) {
      const apiError = err as ApiErrorDTO;
      setError(apiError);
      setSchedule(null);
    } finally {
      setLoading(false);
    }
  }, [scheduleId]);

  // Buscar cronograma ao montar o componente ou quando o ID mudar
  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  return {
    schedule,
    loading,
    error,
    refetch: fetchSchedule,
  };
};
