import { useState, useCallback } from 'react';
import { scheduleService } from '../../services';
import type { ApiErrorDTO } from '../../dtos/common/ApiErrorDTO';
import { useToast } from '../common/useToast';

interface UseExportSchedulePDFReturn {
  exportPDF: (id: number, title: string) => Promise<void>;
  loading: boolean;
  error: ApiErrorDTO | null;
}

export const useExportSchedulePDF = (): UseExportSchedulePDFReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiErrorDTO | null>(null);
  const { addToast } = useToast();

  const exportPDF = useCallback(
    async (id: number, title: string): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const blob = await scheduleService.exportToPDF(id);

        // Criar link para download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cronograma-${title}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        addToast({
          type: 'success',
          message: 'PDF exportado com sucesso!',
        });
      } catch (err) {
        const apiError = err as ApiErrorDTO;
        setError(apiError);
        addToast({
          type: 'error',
          message: apiError.message || 'Erro ao exportar PDF',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast]
  );

  return {
    exportPDF,
    loading,
    error,
  };
};
