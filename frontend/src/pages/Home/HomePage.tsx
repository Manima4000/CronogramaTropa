import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants/routes';

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
          <button
            onClick={() => navigate(ROUTES.schedules.create)}
            className="bg-military-green hover:bg-military-green-dark text-white font-semibold px-8 py-3 rounded transition-all duration-200 shadow-lg"
          >
            <i className="bi bi-plus-circle mr-2"></i>
            Criar Novo Cronograma
          </button>

          <button
            onClick={() => navigate(ROUTES.schedules.list)}
            className="bg-white hover:bg-military-khaki-light text-military-dark font-semibold px-8 py-3 rounded transition-all duration-200 border-2 border-military-gray"
          >
            <i className="bi bi-calendar-check mr-2"></i>
            Ver Meus Cronogramas
          </button>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <i className="bi bi-magic text-3xl text-military-green mb-3"></i>
            <h3 className="text-lg font-semibold text-military-dark mb-2">
              Automático
            </h3>
            <p className="text-sm text-military-gray">
              Gere cronogramas automaticamente baseados nas suas configurações de estudo
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md">
            <i className="bi bi-pencil-square text-3xl text-military-green mb-3"></i>
            <h3 className="text-lg font-semibold text-military-dark mb-2">
              Manual
            </h3>
            <p className="text-sm text-military-gray">
              Crie cronogramas personalizados com drag-and-drop para controle total
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md">
            <i className="bi bi-graph-up text-3xl text-military-green mb-3"></i>
            <h3 className="text-lg font-semibold text-military-dark mb-2">
              Acompanhamento
            </h3>
            <p className="text-sm text-military-gray">
              Visualize e gerencie seus cronogramas de forma organizada
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
