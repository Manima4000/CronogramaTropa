import { useState, useEffect, useCallback } from 'react';
import type { ScheduleDTO } from '../../dtos/schedule/ScheduleDTO';
import { scheduleService } from '../../services';
import type { ApiErrorDTO } from '../../dtos/common/ApiErrorDTO';

interface UseListSchedulesReturn {
  schedules: ScheduleDTO[];
  loading: boolean;
  error: ApiErrorDTO | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para listar todos os cronogramas
 * Responsabilidade:
 * - Buscar cronogramas do backend ao montar o componente
 * - Gerenciar estado de loading e error
 * - Fornecer função refetch para recarregar dados
 */
export const useListSchedules = (): UseListSchedulesReturn => {
  const [schedules, setSchedules] = useState<ScheduleDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiErrorDTO | null>(null);

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await scheduleService.list();
      setSchedules(result);
    } catch (err) {
      const apiError = err as ApiErrorDTO;
      setError(apiError);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar cronogramas ao montar o componente
  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  return {
    schedules,
    loading,
    error,
    refetch: fetchSchedules,
  };
};
