import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useManualSchedule } from '../../../contexts/ManualScheduleContext';
import { useCreateSchedule } from '../../../hooks/schedule/useCreateSchedule';
import { validateManualSchedule } from '../../../utils/validation/manualScheduleValidation';
import { ScheduleBasicInfo } from './ScheduleBasicInfo';
import { CourseAndLessonSelector } from './CourseAndLessonSelector';
import { SelectedLessonsPanel } from './SelectedLessonsPanel';
import { WeekCalendar } from './WeekCalendar';
import { Button } from '../../../shared/ui/Button/Button';
import { Card } from '../../../shared/ui/Card/Card';
import { Icon } from '../../../shared/ui/Icon/Icon';
import { ROUTES } from '../../../utils/constants/routes';
import type { CreateScheduleRequestDTO } from '../../../dtos/schedule/CreateScheduleRequestDTO';

/**
 * Formulário completo de criação manual de cronograma
 * Responsabilidade:
 * - Integrar todos os subcomponentes
 * - Validar dados antes do submit
 * - Transformar state em DTO para envio ao backend
 * - Exibir erros de validação
 */
export const ManualScheduleForm: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useManualSchedule();
  const { createSchedule, loading } = useCreateSchedule();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidation, setShowValidation] = useState(false);

  const handleSubmit = async () => {
    // Validar
    const validation = validateManualSchedule(state);

    if (!validation.isValid) {
      setValidationErrors(validation.errors.map(e => e.message));
      setShowValidation(true);
      // Scroll para o topo para mostrar erros
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setValidationErrors([]);
    setShowValidation(false);

    // Transformar state em DTO
    const dto: CreateScheduleRequestDTO = {
      title: state.title,
      description: state.description,
      courseId: null, // Manual schedule - not tied to a single course
      startDate: state.startDate!.toISOString(),
      endDate: state.endDate!.toISOString(),
      studyDaysPerWeek: state.studyDaysPerWeek,
      hoursPerDay: state.hoursPerDay,
      items: Array.from(state.allocations.values()).map(allocation => ({
        lessonId: allocation.lessonId,
        scheduledDate: allocation.scheduledDate.toISOString(),
        startTime: allocation.startTime,
        duration: allocation.duration,
      })),
    };

    // Criar cronograma
    const result = await createSchedule(dto);

    if (result) {
      navigate(ROUTES.schedules.detail(result.schedule.id));
    }
  };

  const handleValidate = () => {
    const validation = validateManualSchedule(state);
    setValidationErrors(validation.errors.map(e => e.message));
    setShowValidation(true);

    if (validation.isValid) {
      // Mostrar mensagem de sucesso
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCancel = () => {
    if (state.selectedLessons.size > 0 || state.title.trim().length > 0) {
      if (window.confirm('Deseja realmente cancelar? Todas as alterações serão perdidas.')) {
        navigate(ROUTES.schedules.list);
      }
    } else {
      navigate(ROUTES.schedules.list);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mensagens de validação */}
      {showValidation && (
        <Card padding="lg">
          {validationErrors.length === 0 ? (
            <div className="flex items-start gap-3 text-green-800 bg-green-50 p-4 rounded">
              <Icon name="check-circle-fill" size="md" className="text-green-600 mt-0.5" />
              <div>
                <p className="font-semibold">Validação concluída com sucesso!</p>
                <p className="text-sm mt-1">
                  Todos os campos estão corretos. Você pode criar o cronograma agora.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 text-red-800 bg-red-50 p-4 rounded">
              <Icon name="exclamation-triangle" size="md" className="text-red-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold mb-2">
                  Corrija os seguintes erros antes de criar o cronograma:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Informações Básicas */}
      <ScheduleBasicInfo />

      {/* Seleção de Aulas e Painel de Selecionadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CourseAndLessonSelector />
        <SelectedLessonsPanel />
      </div>

      {/* Calendário */}
      <WeekCalendar />

      {/* Ações */}
      <Card padding="lg">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleCancel}
            disabled={loading}
            icon="x-circle"
          >
            Cancelar
          </Button>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={handleValidate}
              disabled={loading}
              icon="shield-check"
            >
              Validar
            </Button>

            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={loading}
              icon="check-circle"
            >
              Criar Cronograma
            </Button>
          </div>
        </div>

        {/* Resumo */}
        <div className="mt-4 pt-4 border-t border-military-gray">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
            <div>
              <p className="text-military-gray">Aulas Selecionadas</p>
              <p className="text-2xl font-bold text-military-dark">
                {state.selectedLessons.size}
              </p>
            </div>
            <div>
              <p className="text-military-gray">Aulas Alocadas</p>
              <p className="text-2xl font-bold text-military-green">
                {state.allocations.size}
              </p>
            </div>
            <div>
              <p className="text-military-gray">Não Alocadas</p>
              <p className="text-2xl font-bold text-yellow-600">
                {state.selectedLessons.size - state.allocations.size}
              </p>
            </div>
            <div>
              <p className="text-military-gray">Duração Total</p>
              <p className="text-2xl font-bold text-military-dark">
                {Array.from(state.allocations.values()).reduce(
                  (sum, alloc) => sum + alloc.duration,
                  0
                )} min
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
