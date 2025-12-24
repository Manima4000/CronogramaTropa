import { Schedule } from '../entities/Schedule';

// DTO para criação de Schedule (dados primitivos)
export interface CreateScheduleData {
  title: string;
  description: string | null;
  courseId: number;
  startDate: Date;
  endDate: Date;
  studyDaysPerWeek: number;
  hoursPerDay: number;
}

// DTO para atualização de Schedule (dados primitivos)
export interface UpdateScheduleData {
  title?: string;
  description?: string | null;
  courseId?: number;
  startDate?: Date;
  endDate?: Date;
  studyDaysPerWeek?: number;
  hoursPerDay?: number;
}

// Interface Segregation Principle (I do SOLID)
export interface IScheduleRepository {
  create(data: CreateScheduleData): Promise<Schedule>;
  findAll(): Promise<Schedule[]>;
  findById(id: number): Promise<Schedule | null>;
  update(id: number, data: UpdateScheduleData): Promise<Schedule>;
  delete(id: number): Promise<void>;
}
