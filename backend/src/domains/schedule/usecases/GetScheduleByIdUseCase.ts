import { IScheduleRepository } from '../repositories/IScheduleRepository';
import { IScheduleItemRepository } from '../repositories/IScheduleItemRepository';
import { Schedule } from '../entities/Schedule';
import { ScheduleItem } from '../entities/ScheduleItem';

interface GetScheduleByIdOutput {
  schedule: Schedule;
  items: ScheduleItem[];
}

// Single Responsibility Principle (S do SOLID)
export class GetScheduleByIdUseCase {
  constructor(
    private scheduleRepository: IScheduleRepository,
    private scheduleItemRepository: IScheduleItemRepository
  ) {}

  async execute(id: number): Promise<GetScheduleByIdOutput | null> {
    const schedule = await this.scheduleRepository.findById(id);

    if (!schedule) {
      return null;
    }

    const items = await this.scheduleItemRepository.findByScheduleId(id);

    return {
      schedule,
      items,
    };
  }
}
