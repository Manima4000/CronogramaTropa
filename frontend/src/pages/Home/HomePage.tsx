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
        <button
          onClick={() => navigate(ROUTES.schedules.list)}
          className="bg-military-green hover:bg-military-green-dark text-white font-semibold px-8 py-3 rounded transition-all duration-200"
        >
          <i className="bi bi-calendar-check mr-2"></i>
          Ver Cronogramas
        </button>
      </div>
    </div>
  );
};
