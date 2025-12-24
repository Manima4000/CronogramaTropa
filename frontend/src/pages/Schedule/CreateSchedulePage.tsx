import { ScheduleForm } from '../../components/schedule/ScheduleForm/ScheduleForm';

export const CreateSchedulePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-military-dark">
          Criar Novo Cronograma
        </h1>
        <p className="text-military-gray mt-2">
          Preencha as informações abaixo para gerar seu cronograma de estudos
        </p>
      </div>

      <ScheduleForm />
    </div>
  );
};
