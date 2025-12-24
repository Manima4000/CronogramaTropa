import { useState, useCallback } from 'react';
import { scheduleService } from '../../services';
import type { ApiErrorDTO } from '../../dtos/common/ApiErrorDTO';
import { useToast } from '../common/useToast';

interface UseDeleteScheduleReturn {
  deleteSchedule: (id: number) => Promise<boolean>;
  loading: boolean;
  error: ApiErrorDTO | null;
}

export const useDeleteSchedule = (): UseDeleteScheduleReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiErrorDTO | null>(null);
  const { addToast } = useToast();

  const deleteSchedule = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);
        await scheduleService.delete(id);
        addToast({
          type: 'success',
          message: 'Cronograma excluído com sucesso!',
        });
        return true;
      } catch (err) {
        const apiError = err as ApiErrorDTO;
        setError(apiError);
        addToast({
          type: 'error',
          message: apiError.message || 'Erro ao excluir cronograma',
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [addToast]
  );

  return {
    deleteSchedule,
    loading,
    error,
  };
};
