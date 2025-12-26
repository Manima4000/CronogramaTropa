import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants/routes';
import { Button } from '../../shared/ui/Button/Button';
import { Card } from '../../shared/ui/Card/Card';
import { Icon } from '../../shared/ui/Icon/Icon';

/**
 * Página inicial do sistema
 * Responsabilidade:
 * - Apresentar o sistema ao usuário
 * - Fornecer navegação rápida para funcionalidades principais
 * - Destacar features do sistema
 */
export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-military-dark mb-4">
          CronogramaTropa
        </h1>
        <p className="text-xl text-military-gray mb-8">
          Sistema de gerenciamento de cronogramas de estudo
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate(ROUTES.schedules.create)}
            icon="plus-circle"
          >
            Criar Novo Cronograma
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate(ROUTES.schedules.list)}
            icon="calendar-check"
          >
            Ver Meus Cronogramas
          </Button>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <Card padding="lg">
            <Icon name="pencil-square" size="sm" className="text-military-green mb-3" />
            <h3 className="text-lg font-semibold text-military-dark mb-2">
              Criação Manual
            </h3>
            <p className="text-sm text-military-gray">
              Crie cronogramas personalizados com drag-and-drop para controle total
            </p>
          </Card>

          <Card padding="lg">
            <Icon name="calendar-week" size="sm" className="text-military-green mb-3" />
            <h3 className="text-lg font-semibold text-military-dark mb-2">
              Múltiplos Cursos
            </h3>
            <p className="text-sm text-military-gray">
              Selecione aulas de diferentes cursos e organize em um único cronograma
            </p>
          </Card>

          <Card padding="lg">
            <Icon name="graph-up" size="sm" className="text-military-green mb-3" />
            <h3 className="text-lg font-semibold text-military-dark mb-2">
              Visualização
            </h3>
            <p className="text-sm text-military-gray">
              Acompanhe e gerencie seus cronogramas de forma organizada
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
