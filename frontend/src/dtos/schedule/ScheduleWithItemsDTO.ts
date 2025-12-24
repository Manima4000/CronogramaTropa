import type { ScheduleDTO } from './ScheduleDTO';
import type { ScheduleItemDTO } from './ScheduleItemDTO';

export interface ScheduleWithItemsDTO {
  schedule: ScheduleDTO;
  items: ScheduleItemDTO[];
}
