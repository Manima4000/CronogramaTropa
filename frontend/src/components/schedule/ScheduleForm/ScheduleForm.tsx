import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { createScheduleSchema, type CreateScheduleFormData } from '../../../utils/validation/scheduleValidation';
import { useCreateSchedule } from '../../../hooks/schedule/useCreateSchedule';
import { Input } from '../../../shared/ui/Input/Input';
import { Button } from '../../../shared/ui/Button/Button';
import { Card } from '../../../shared/ui/Card/Card';
import { CourseSelector } from './CourseSelector';
import { ROUTES } from '../../../utils/constants/routes';


export const ScheduleForm: React.FC = () => {
  const navigate = useNavigate();
  const { createSchedule, loading } = useCreateSchedule();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateScheduleFormData>({
    resolver: yupResolver(createScheduleSchema) as Resolver<CreateScheduleFormData>,
    defaultValues: {
      studyDaysPerWeek: 5,
      hoursPerDay: 2,
    },
  });

  const onSubmit = async (data: CreateScheduleFormData) => {
    const result = await createSchedule({
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
    });

    if (result) {
      navigate(ROUTES.schedules.detail(result.schedule.id));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto">
      <Card padding="lg">
        <h2 className="text-2xl font-bold text-military-dark mb-6">
          Informações do Cronograma
        </h2>

        <div className="space-y-4">
          {/* Título */}
          <Input
            label="Título *"
            placeholder="Ex: Cronograma de Estudos - Angular"
            {...register('title')}
            error={errors.title?.message}
            fullWidth
          />

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-military-dark mb-1">
              Descrição
            </label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Descrição opcional do cronograma"
              className={`
                px-4 py-2 rounded border w-full
                ${errors.description ? 'border-red-500' : 'border-military-gray'}
                focus:outline-none focus:ring-2
                ${errors.description ? 'focus:ring-red-500' : 'focus:ring-military-green'}
              `.trim()}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Curso */}
          <CourseSelector
            {...register('courseId', { valueAsNumber: true })}
            error={errors.courseId?.message}
          />

          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Data de Início *"
              {...register('startDate')}
              error={errors.startDate?.message}
              fullWidth
            />

            <Input
              type="date"
              label="Data de Término *"
              {...register('endDate')}
              error={errors.endDate?.message}
              fullWidth
            />
          </div>

          <h3 className="text-xl font-semibold text-military-dark mt-6 mb-4">
            Configuração de Estudo
          </h3>

          {/* Dias por semana e horas por dia */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              label="Dias de Estudo por Semana *"
              min={1}
              max={7}
              {...register('studyDaysPerWeek', { valueAsNumber: true })}
              error={errors.studyDaysPerWeek?.message}
              fullWidth
            />

            <Input
              type="number"
              label="Horas por Dia *"
              min={1}
              max={24}
              {...register('hoursPerDay', { valueAsNumber: true })}
              error={errors.hoursPerDay?.message}
              fullWidth
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(ROUTES.schedules.list)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon="check-circle"
              loading={loading}
            >
              Criar Cronograma
            </Button>
          </div>
        </div>
      </Card>
    </form>
  );
};
