import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants/routes';
import { Card } from '../../shared/ui/Card/Card';
import { Button } from '../../shared/ui/Button/Button';
import { Icon } from '../../shared/ui/Icon/Icon';
import { LoadingOverlay } from '../../shared/feedback/LoadingOverlay';
import { useListSchedules } from '../../hooks/schedule/useListSchedules';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Página de listagem de cronogramas
 * Responsabilidade:
 * - Exibir todos os cronogramas do usuário
 * - Permitir navegação para criação e visualização
 * - Mostrar informações resumidas de cada cronograma
 */
export const ScheduleListPage: React.FC = () => {
  const navigate = useNavigate();
  const { schedules, loading, error } = useListSchedules();

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} dias`;
    } catch {
      return '-';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-military-dark">
            Meus Cronogramas
          </h1>
          <p className="text-military-gray mt-2">
            Gerencie seus cronogramas de estudo
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate(ROUTES.schedules.create)}
          icon="plus-circle"
        >
          Criar Novo Cronograma
        </Button>
      </div>

      {/* Estado de erro */}
      {error && (
        <Card padding="lg" className="mb-6">
          <div className="flex items-start gap-3 text-red-800 bg-red-50 p-4 rounded">
            <Icon name="exclamation-triangle" size="md" className="text-red-600 mt-0.5" />
            <div>
              <p className="font-semibold">Erro ao carregar cronogramas</p>
              <p className="text-sm mt-1">{error.message || 'Tente novamente mais tarde.'}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Lista de cronogramas */}
      {!loading && !error && schedules.length === 0 && (
        <Card padding="lg">
          <div className="text-center py-12">
            <Icon name="calendar-x" size="sm" className="text-military-gray opacity-50 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-military-dark mb-2">
              Nenhum cronograma encontrado
            </h3>
            <p className="text-military-gray mb-6">
              Comece criando seu primeiro cronograma de estudos
            </p>
            <Button
              variant="primary"
              onClick={() => navigate(ROUTES.schedules.create)}
              icon="plus-circle"
            >
              Criar Primeiro Cronograma
            </Button>
          </div>
        </Card>
      )}

      {!loading && !error && schedules.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedules.map((schedule) => (
            <Card key={schedule.id} padding="lg" className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(ROUTES.schedules.detail(schedule.id))}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-military-dark mb-1 line-clamp-2">
                    {schedule.title}
                  </h3>
                  {schedule.description && (
                    <p className="text-sm text-military-gray line-clamp-2">
                      {schedule.description}
                    </p>
                  )}
                </div>
                <Icon name="calendar-check" size="md" className="text-military-green ml-2 shrink-0" />
              </div>

              <div className="space-y-2 text-sm text-military-gray mb-4">
                <div className="flex items-center gap-2">
                  <Icon name="calendar" size="sm" />
                  <span>
                    {formatDate(schedule.startDate)} - {formatDate(schedule.endDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="clock" size="sm" />
                  <span>{calculateDuration(schedule.startDate, schedule.endDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="calendar-event" size="sm" />
                  <span>Criado em {formatDate(schedule.createdAt)}</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(ROUTES.schedules.detail(schedule.id));
                }}
                icon="eye"
              >
                Ver Detalhes
              </Button>
            </Card>
          ))}
        </div>
      )}

      {loading && <LoadingOverlay message="Carregando cronogramas..." />}
    </div>
  );
};
