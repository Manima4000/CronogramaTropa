import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
} from '@dnd-kit/core';
import { useManualSchedule, type ScheduleItemAllocation } from '../../../contexts/ManualScheduleContext';
import { useCreateSchedule } from '../../../hooks/schedule/useCreateSchedule';
import { useToast } from '../../../contexts/ToastContext';
import { validateManualSchedule } from '../../../utils/validation/manualScheduleValidation';
import { formatDateForInput } from '../../../utils/date/dateHelpers';
import { ScheduleBasicInfo } from './ScheduleBasicInfo';
import { CourseAndLessonSelector } from './CourseAndLessonSelector';
import { SelectedLessonsPanel } from './SelectedLessonsPanel';
import { UnallocatedLessonsPanel } from './UnallocatedLessonsPanel';
import { WeekCalendar } from './WeekCalendar';
import { LessonCard } from './LessonCard';
import { EditAllocationModal } from './EditAllocationModal';
import { Button } from '../../../shared/ui/Button/Button';
import { Card } from '../../../shared/ui/Card/Card';
import { Icon } from '../../../shared/ui/Icon/Icon';
import { LoadingOverlay } from '../../../shared/feedback/LoadingOverlay';
import { ROUTES } from '../../../utils/constants/routes';
import type { CreateScheduleRequestDTO } from '../../../dtos/schedule/CreateScheduleRequestDTO';
import type { LessonWithVideoDTO } from '../../../dtos/course/LessonDTO';

/**
 * Formulário completo de criação manual de cronograma
 * Responsabilidade:
 * - Integrar todos os subcomponentes
 * - Validar dados antes do submit
 * - Transformar state em DTO para envio ao backend
 * - Exibir erros de validação
 * - Guiar o usuário através do fluxo
 */
export const ManualScheduleForm: React.FC = () => {
  const navigate = useNavigate();
  const { state, allocateLesson, updateAllocation, removeAllocation, isLessonAllocated } = useManualSchedule();
  const { createSchedule, loading } = useCreateSchedule();
  const { addToast } = useToast();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidation, setShowValidation] = useState(false);
  const [draggedLesson, setDraggedLesson] = useState<LessonWithVideoDTO | null>(null);
  const [editingLesson, setEditingLesson] = useState<{
    lesson: LessonWithVideoDTO;
    allocation: ScheduleItemAllocation;
  } | null>(null);

  // Configurar sensores para drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Exigir movimento de 8px antes de iniciar o drag
      },
    })
  );

  const handleSubmit = async () => {
    try {
      // Validar
      const validation = validateManualSchedule(state);

      if (!validation.isValid) {
        setValidationErrors(validation.errors.map(e => e.message));
        setShowValidation(true);

        addToast({
          type: 'error',
          message: `${validation.errors.length} erro(s) de validação encontrado(s). Corrija antes de continuar.`,
          duration: 5000,
        });

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
        items: Array.from(state.allocations.values()).map(allocation => ({
          lessonId: allocation.lessonId,
          scheduledDate: formatDateForInput(allocation.scheduledDate), // YYYY-MM-DD apenas (sem hora)
          startTime: allocation.startTime,
          duration: allocation.duration,
        })),
      };

      // Criar cronograma
      const result = await createSchedule(dto);

      if (result) {
        addToast({
          type: 'success',
          message: 'Cronograma criado com sucesso!',
          duration: 3000,
        });
        navigate(ROUTES.schedules.detail(result.schedule.id));
      } else {
        addToast({
          type: 'error',
          message: 'Erro ao criar cronograma. Tente novamente.',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error creating schedule:', error);
      addToast({
        type: 'error',
        message: 'Erro inesperado ao criar cronograma. Verifique sua conexão e tente novamente.',
        duration: 5000,
      });
    }
  };

  const handleValidate = () => {
    const validation = validateManualSchedule(state);
    setValidationErrors(validation.errors.map(e => e.message));
    setShowValidation(true);

    if (validation.isValid) {
      addToast({
        type: 'success',
        message: 'Validação concluída com sucesso! Todos os campos estão corretos.',
        duration: 4000,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      addToast({
        type: 'warning',
        message: `${validation.errors.length} erro(s) encontrado(s). Verifique os detalhes acima.`,
        duration: 5000,
      });
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

  // Handlers de Drag-and-Drop
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const lesson = active.data.current?.lesson;
    if (lesson) {
      setDraggedLesson(lesson);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedLesson(null);

    if (!over) return;

    // Extrair dados do drag
    const lesson = active.data.current?.lesson as LessonWithVideoDTO;
    const { date, timeSlot } = over.data.current as { date: Date; timeSlot: string };

    if (!lesson || !date || !timeSlot) return;

    // Criar alocação
    const allocation: ScheduleItemAllocation = {
      lessonId: lesson.id,
      scheduledDate: date,
      startTime: timeSlot,
      duration: lesson.video?.duration || 60, // Default 60 min se não tiver vídeo
    };

    allocateLesson(lesson.id, allocation);
  };

  const handleDragCancel = () => {
    setDraggedLesson(null);
  };

  const handleLessonClick = (lesson: LessonWithVideoDTO, allocation: ScheduleItemAllocation) => {
    setEditingLesson({ lesson, allocation });
  };

  const handleSaveAllocation = (updates: Partial<ScheduleItemAllocation>) => {
    if (editingLesson) {
      updateAllocation(editingLesson.lesson.id, updates);
    }
  };

  const handleDeleteAllocation = () => {
    if (editingLesson) {
      removeAllocation(editingLesson.lesson.id);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      autoScroll={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
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

      {/* Passo 1: Informações Básicas */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-military-green text-white font-bold text-sm">
            1
          </div>
          <h2 className="text-lg font-semibold text-military-dark">
            Informações Básicas
          </h2>
        </div>
      </div>
      <ScheduleBasicInfo />

      {/* Passo 2: Seleção de Aulas */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-military-green text-white font-bold text-sm">
            2
          </div>
          <h2 className="text-lg font-semibold text-military-dark">
            Seleção de Aulas
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <CourseAndLessonSelector />
        <SelectedLessonsPanel />
      </div>

      {/* Passo 3: Alocação no Calendário */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-military-green text-white font-bold text-sm">
            3
          </div>
          <h2 className="text-lg font-semibold text-military-dark">
            Alocação no Calendário
          </h2>
        </div>
      </div>

      {/* Aulas Não Alocadas */}
      {state.selectedLessons.size > 0 && (
        <UnallocatedLessonsPanel isDragging={!!draggedLesson} />
      )}

      {/* Calendário */}
      <WeekCalendar onLessonClick={handleLessonClick} isDragging={!!draggedLesson} />

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

        {/* Loading Overlay */}
        {loading && <LoadingOverlay message="Criando cronograma..." />}
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {draggedLesson ? (
          <LessonCard
            lesson={draggedLesson}
            isAllocated={isLessonAllocated(draggedLesson.id)}
          />
        ) : null}
      </DragOverlay>

      {/* Modal de Edição */}
      {editingLesson && (
        <EditAllocationModal
          lesson={editingLesson.lesson}
          allocation={editingLesson.allocation}
          isOpen={!!editingLesson}
          onClose={() => setEditingLesson(null)}
          onSave={handleSaveAllocation}
          onDelete={handleDeleteAllocation}
        />
      )}
    </DndContext>
  );
};
