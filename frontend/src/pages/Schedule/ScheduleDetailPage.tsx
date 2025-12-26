import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useScheduleDetails } from '../../hooks/schedule/useScheduleDetails';
import { useDeleteSchedule } from '../../hooks/schedule/useDeleteSchedule';
import { useExportSchedulePDF } from '../../hooks/schedule/useExportSchedulePDF';
import { Button } from '../../shared/ui/Button/Button';
import { Card } from '../../shared/ui/Card/Card';
import { Icon } from '../../shared/ui/Icon/Icon';
import { LoadingOverlay } from '../../shared/feedback/LoadingOverlay';
import { ConfirmDialog } from '../../shared/ui/Modal/ConfirmDialog';
import { ROUTES } from '../../utils/constants/routes';
import type { ScheduleItemWithLessonDTO } from '../../dtos/schedule/ScheduleItemDTO';

/**
 * Página de detalhes do cronograma
 * Responsabilidade:
 * - Exibir informações completas de um cronograma
 * - Mostrar estatísticas e resumo
 * - Listar aulas agrupadas por data
 * - Fornecer ações (voltar, deletar, etc.)
 */
export const ScheduleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { schedule, loading, error } = useScheduleDetails(Number(id));
  const { deleteSchedule, loading: deleting } = useDeleteSchedule();
  const { exportPDF, loading: exporting } = useExportSchedulePDF();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const formatDateLong = (dateString: string) => {
    try {
      return format(parseISO(dateString), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const formatTime = (time: string) => {
    // Tempo já vem em formato HH:mm
    return time;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    const success = await deleteSchedule(Number(id));
    if (success) {
      setShowDeleteDialog(false);
      navigate(ROUTES.schedules.list);
    }
  };

  const handleExportPDF = async () => {
    if (!schedule) return;
    await exportPDF(Number(id), schedule.schedule.title);
  };

  // Agrupar items por data
  const groupItemsByDate = (items: ScheduleItemWithLessonDTO[]) => {
    const grouped = items.reduce((acc, item) => {
      const date = item.scheduledDate.split('T')[0]; // YYYY-MM-DD
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {} as Record<string, ScheduleItemWithLessonDTO[]>);

    // Ordenar items dentro de cada data por startTime
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => a.startTime.localeCompare(b.startTime));
    });

    return grouped;
  };

  // Calcular estatísticas
  const getStats = () => {
    if (!schedule) return null;

    const totalItems = schedule.items.length;
    const totalDuration = schedule.items.reduce((sum, item) => sum + item.duration, 0);

    return {
      totalItems,
      totalDuration,
    };
  };

  if (loading) {
    return <LoadingOverlay message="Carregando cronograma..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card padding="lg">
          <div className="flex items-start gap-3 text-red-800 bg-red-50 p-4 rounded">
            <Icon name="exclamation-triangle" size="md" className="text-red-600 mt-0.5" />
            <div>
              <p className="font-semibold">Erro ao carregar cronograma</p>
              <p className="text-sm mt-1">{error.message || 'Cronograma não encontrado'}</p>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="secondary" onClick={() => navigate(ROUTES.schedules.list)} icon="arrow-left">
              Voltar para Cronogramas
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!schedule) {
    return null;
  }

  const stats = getStats();
  const itemsByDate = groupItemsByDate(schedule.items);
  const dates = Object.keys(itemsByDate).sort();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(ROUTES.schedules.list)}
          icon="arrow-left"
          className="mb-4"
        >
          Voltar
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-military-dark mb-2">
              {schedule.schedule.title}
            </h1>
            {schedule.schedule.description && (
              <p className="text-military-gray">{schedule.schedule.description}</p>
            )}
            <div className="flex items-center gap-4 mt-3 text-sm text-military-gray">
              <div className="flex items-center gap-2">
                <Icon name="calendar" size="sm" />
                <span>
                  {formatDate(schedule.schedule.startDate)} - {formatDate(schedule.schedule.endDate)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon="file-earmark-pdf"
              onClick={handleExportPDF}
              loading={exporting}
            >
              Exportar PDF
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon="trash"
              onClick={handleDeleteClick}
              loading={deleting}
            >
              Deletar
            </Button>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-military-gray">Total de Aulas</p>
                <p className="text-2xl font-bold text-military-dark mt-1">{stats.totalItems}</p>
              </div>
              <Icon name="list-check" size="lg" className="text-military-green" />
            </div>
          </Card>

          <Card padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-military-gray">Duração Total</p>
                <p className="text-2xl font-bold text-military-dark mt-1">{formatDuration(stats.totalDuration)}</p>
              </div>
              <Icon name="clock" size="lg" className="text-military-green" />
            </div>
          </Card>
        </div>
      )}

      {/* Lista de Aulas por Data */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-military-dark">Cronograma de Aulas</h2>

        {dates.map(date => (
          <Card key={date} padding="lg">
            <h3 className="text-lg font-semibold text-military-dark mb-4 flex items-center gap-2">
              <Icon name="calendar-event" size="md" className="text-military-green" />
              {formatDateLong(date)}
            </h3>

            <div className="space-y-3">
              {itemsByDate[date].map(item => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-4 rounded border-2 bg-white border-military-light-gray hover:border-military-green transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-military-dark mb-1">
                      {item.lesson.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-military-gray">
                      <div className="flex items-center gap-1">
                        <Icon name="clock" size="sm" />
                        <span>{formatTime(item.startTime)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="hourglass" size="sm" />
                        <span>{formatDuration(item.duration)}</span>
                      </div>
                      {item.lesson.position !== undefined && (
                        <div className="flex items-center gap-1">
                          <Icon name="hash" size="sm" />
                          <span>Aula {item.lesson.position}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {schedule.items.length === 0 && (
        <Card padding="lg">
          <div className="text-center py-12">
            <Icon name="calendar-x" size="sm" className="text-military-gray opacity-50 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-military-dark mb-2">
              Nenhuma aula encontrada
            </h3>
            <p className="text-military-gray">
              Este cronograma ainda não possui aulas agendadas.
            </p>
          </div>
        </Card>
      )}

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Deletar Cronograma"
        message={`Tem certeza que deseja deletar o cronograma "${schedule?.schedule.title}"? Esta ação não pode ser desfeita.`}
        confirmText="Deletar"
        cancelText="Cancelar"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
};
