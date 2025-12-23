import { Schedule } from '../entities/Schedule';

// Interface Segregation Principle (I do SOLID)
export interface IScheduleRepository {
  create(schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<Schedule>;
  findAll(): Promise<Schedule[]>;
  findById(id: string): Promise<Schedule | null>;
  update(id: string, data: Partial<Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Schedule>;
  delete(id: string): Promise<void>;
}
