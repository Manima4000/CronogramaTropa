import { ScheduleItem } from '../entities/ScheduleItem';

export interface IScheduleItemRepository {
  create(item: Omit<ScheduleItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ScheduleItem>;
  createMany(items: Omit<ScheduleItem, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<void>;
  findByScheduleId(scheduleId: string): Promise<ScheduleItem[]>;
  updateCompletion(id: string, completed: boolean): Promise<ScheduleItem>;
  deleteByScheduleId(scheduleId: string): Promise<void>;
}
