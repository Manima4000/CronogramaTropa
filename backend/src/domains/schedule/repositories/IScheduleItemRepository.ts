import { ScheduleItem } from '../entities/ScheduleItem';

// DTO para criação de ScheduleItem (dados primitivos)
export interface CreateScheduleItemData {
  scheduleId: number;
  lessonId: number;
  scheduledDate: Date;
  startTime: string; // Formato HH:mm (ex: "14:30")
  duration: number; // Duração em minutos
  completed: boolean;
}

export interface IScheduleItemRepository {
  create(data: CreateScheduleItemData): Promise<ScheduleItem>;
  createMany(items: CreateScheduleItemData[]): Promise<void>;
  findByScheduleId(scheduleId: number): Promise<ScheduleItem[]>;
  updateCompletion(id: number, completed: boolean): Promise<ScheduleItem>;
  deleteByScheduleId(scheduleId: number): Promise<void>;
}
