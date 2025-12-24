import { useState, useEffect, useCallback } from 'react';
import type { ScheduleDTO } from '../../dtos/schedule/ScheduleDTO';
import { scheduleService } from '../../services';
import type { ApiErrorDTO } from '../../dtos/common/ApiErrorDTO';

interface UseScheduleListReturn {
  schedules: ScheduleDTO[] | null;
  loading: boolean;
  error: ApiErrorDTO | null;
  refetch: () => Promise<void>;
}

// Single Responsibility: Encapsulates schedule list fetching logic
export const useScheduleList = (): UseScheduleListReturn => {
  const [schedules, setSchedules] = useState<ScheduleDTO[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiErrorDTO | null>(null);

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await scheduleService.list();
      setSchedules(data);
    } catch (err) {
      setError(err as ApiErrorDTO);
    } finally {
      setLoading(false);
    }
  }, []);

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
