import { useState, useCallback } from 'react';
import { scheduleService } from '../../services';
import type { ApiErrorDTO } from '../../dtos/common/ApiErrorDTO';
import { useToast } from '../common/useToast';

interface UseExportScheduleReturn {
  exportToPDF: (id: number, filename?: string) => Promise<void>;
  loading: boolean;
  error: ApiErrorDTO | null;
}

export const useExportSchedule = (): UseExportScheduleReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiErrorDTO | null>(null);
  const { addToast } = useToast();

  const exportToPDF = useCallback(
    async (id: number, filename: string = `cronograma-${id}.pdf`): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const blob = await scheduleService.exportToPDF(id);

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        addToast({
          type: 'success',
          message: 'Cronograma exportado com sucesso!',
        });
      } catch (err) {
        const apiError = err as ApiErrorDTO;
        setError(apiError);
        addToast({
          type: 'error',
          message: apiError.message || 'Erro ao exportar cronograma',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast]
  );

  return {
    exportToPDF,
    loading,
    error,
  };
};
