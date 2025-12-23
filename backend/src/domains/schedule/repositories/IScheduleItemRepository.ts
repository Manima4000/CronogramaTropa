import { ScheduleItem } from '../entities/ScheduleItem';

export interface IScheduleItemRepository {
  create(item: Omit<ScheduleItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ScheduleItem>;
  createMany(items: Omit<ScheduleItem, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<void>;
  findByScheduleId(scheduleId: number): Promise<ScheduleItem[]>;
  updateCompletion(id: number, completed: boolean): Promise<ScheduleItem>;
  deleteByScheduleId(scheduleId: number): Promise<void>;
}
