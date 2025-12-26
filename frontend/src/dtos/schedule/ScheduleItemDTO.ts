import type { LessonDTO } from '../course/LessonDTO';

export interface ScheduleItemDTO {
  id: number;
  scheduleId: number;
  lessonId: number;
  scheduledDate: string; // ISO 8601 datetime string
  startTime: string; // HH:mm format
  duration: number; // minutes
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * ScheduleItem enriquecido com dados da lesson
 * Usado na visualização de detalhes do cronograma
 */
export interface ScheduleItemWithLessonDTO extends ScheduleItemDTO {
  lesson: LessonDTO;
}
