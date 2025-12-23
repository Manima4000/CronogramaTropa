import { IScheduleRepository } from '../repositories/IScheduleRepository';
import { Schedule } from '../entities/Schedule';

// Single Responsibility Principle (S do SOLID)
export class ListSchedulesUseCase {
  constructor(private scheduleRepository: IScheduleRepository) {}

  async execute(): Promise<Schedule[]> {
    return await this.scheduleRepository.findAll();
  }
}
