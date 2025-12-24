import { useState, useCallback } from 'react';
import type { CreateScheduleRequestDTO } from '../../dtos/schedule/CreateScheduleRequestDTO';
import type { ScheduleWithItemsDTO } from '../../dtos/schedule/ScheduleWithItemsDTO';
import { scheduleService } from '../../services';
import type { ApiErrorDTO } from '../../dtos/common/ApiErrorDTO';
import { useToast } from '../common/useToast';

interface UseCreateScheduleReturn {
  createSchedule: (data: CreateScheduleRequestDTO) => Promise<ScheduleWithItemsDTO | null>;
  loading: boolean;
  error: ApiErrorDTO | null;
}

export const useCreateSchedule = (): UseCreateScheduleReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiErrorDTO | null>(null);
  const { addToast } = useToast();

  const createSchedule = useCallback(
    async (data: CreateScheduleRequestDTO): Promise<ScheduleWithItemsDTO | null> => {
      try {
        setLoading(true);
        setError(null);
        const result = await scheduleService.create(data);
        addToast({
          type: 'success',
          message: 'Cronograma criado com sucesso!',
        });
        return result;
      } catch (err) {
        const apiError = err as ApiErrorDTO;
        setError(apiError);
        addToast({
          type: 'error',
          message: apiError.message || 'Erro ao criar cronograma',
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [addToast]
  );

  return {
    createSchedule,
    loading,
    error,
  };
};
