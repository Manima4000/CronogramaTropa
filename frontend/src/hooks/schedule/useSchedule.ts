import { useState, useEffect, useCallback } from 'react';
import type { ScheduleWithItemsDTO } from '../../dtos/schedule/ScheduleWithItemsDTO';
import { scheduleService } from '../../services';
import type { ApiErrorDTO } from '../../dtos/common/ApiErrorDTO';

interface UseScheduleReturn {
  schedule: ScheduleWithItemsDTO | null;
  loading: boolean;
  error: ApiErrorDTO | null;
  refetch: () => Promise<void>;
}

// Single Responsibility: Fetch schedule by ID with items
export const useSchedule = (id: number): UseScheduleReturn => {
  const [schedule, setSchedule] = useState<ScheduleWithItemsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiErrorDTO | null>(null);

  const fetchSchedule = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await scheduleService.getById(id);
      setSchedule(data);
    } catch (err) {
      setError(err as ApiErrorDTO);
    } finally {
      setLoading(false);
    }
  }, [id]);

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
