import React, { useState } from 'react';
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useManualSchedule, type ScheduleItemAllocation } from '../../../contexts/ManualScheduleContext';
import { useWeekNavigation } from '../../../hooks/schedule/useWeekNavigation';
import { useTimeSlots } from '../../../hooks/schedule/useTimeSlots';
import { Card } from '../../../shared/ui/Card/Card';
import { Icon } from '../../../shared/ui/Icon/Icon';
import { WeekCalendarHeader } from './WeekCalendarHeader';
import { WeekCalendarGrid } from './WeekCalendarGrid';
import { WeekCalendarFooter } from './WeekCalendarFooter';
import { LessonCard } from './LessonCard';
import { EditAllocationModal } from './EditAllocationModal';
import type { LessonWithVideoDTO } from '../../../dtos/course/LessonDTO';

/**
 * Componente principal do calendário semanal
 * Responsabilidade:
 * - Orquestrar subcomponentes (Header, Grid, Footer, Modal)
 * - Gerenciar contexto de drag-and-drop
 * - Implementar lógica de alocação e edição de aulas
 * - Delegar responsabilidades específicas para subcomponentes
 */
export const WeekCalendar: React.FC = () => {
  const { state, allocateLesson, updateAllocation, removeAllocation, isLessonAllocated } = useManualSchedule();
  const [draggedLesson, setDraggedLesson] = useState<LessonWithVideoDTO | null>(null);
  const [editingLesson, setEditingLesson] = useState<{
    lesson: LessonWithVideoDTO;
    allocation: ScheduleItemAllocation;
  } | null>(null);

  const {
    weekDays,
    canGoPrevious,
    canGoNext,
    navigatePreviousWeek,
    navigateNextWeek,
  } = useWeekNavigation({
    startDate: state.startDate,
    endDate: state.endDate,
    studyDaysPerWeek: state.studyDaysPerWeek,
  });

  const timeSlots = useTimeSlots({
    hoursPerDay: state.hoursPerDay,
    startHour: 8,
  });

  // Configurar sensores para drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Exigir movimento de 8px antes de iniciar o drag
      },
    })
  );

  const handleDragStart = (event: any) => {
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

  // Estado vazio: sem datas configuradas
  if (!state.startDate || !state.endDate) {
    return (
      <Card padding="lg">
        <div className="text-center py-12 text-military-gray">
          <Icon name="calendar" size="lg" className="mx-auto mb-3 opacity-50" />
          <p className="font-medium">Configure as datas do cronograma</p>
          <p className="text-sm mt-1">
            Preencha as informações básicas acima para visualizar o calendário
          </p>
        </div>
      </Card>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <Card padding="lg">
        <WeekCalendarHeader
          firstDay={weekDays[0]}
          lastDay={weekDays[weekDays.length - 1]}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
          onPrevious={navigatePreviousWeek}
          onNext={navigateNextWeek}
        />

        <WeekCalendarGrid
          weekDays={weekDays}
          timeSlots={timeSlots}
          onLessonClick={handleLessonClick}
        />

        <WeekCalendarFooter
          studyDaysPerWeek={state.studyDaysPerWeek}
          hoursPerDay={state.hoursPerDay}
        />
      </Card>

      {/* Overlay para mostrar o card durante o drag */}
      <DragOverlay>
        {draggedLesson ? (
          <LessonCard
            lesson={draggedLesson}
            isAllocated={isLessonAllocated(draggedLesson.id)}
          />
        ) : null}
      </DragOverlay>

      {/* Modal de edição */}
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
