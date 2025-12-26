import type { ScheduleDTO } from './ScheduleDTO';
import type { ScheduleItemDTO, ScheduleItemWithLessonDTO } from './ScheduleItemDTO';

export interface ScheduleWithItemsDTO {
  schedule: ScheduleDTO;
  items: ScheduleItemDTO[];
}

/**
 * Schedule com items enriquecidos (incluindo dados das lessons)
 * Usado na página de detalhes do cronograma
 */
export interface ScheduleWithDetailsDTO {
  schedule: ScheduleDTO;
  items: ScheduleItemWithLessonDTO[];
}
