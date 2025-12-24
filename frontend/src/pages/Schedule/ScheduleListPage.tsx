import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants/routes';
import { Card } from '../../shared/ui/Card/Card';
import { Button } from '../../shared/ui/Button/Button';

export const ScheduleListPage: React.FC = () => {
  const navigate = useNavigate();

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

      <Card padding="lg">
        <div className="text-center py-12">
          <i className="bi bi-calendar-x text-6xl text-military-gray opacity-50 mb-4"></i>
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
    </div>
  );
};
