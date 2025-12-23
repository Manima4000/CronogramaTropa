import { Schedule } from '../../domains/schedule/entities/Schedule';
import { ScheduleItem } from '../../domains/schedule/entities/ScheduleItem';

export interface ScheduleWithItems {
  schedule: Schedule;
  items: ScheduleItem[];
}

// Dependency Inversion Principle (D do SOLID)
export interface IPDFProvider {
  generateSchedulePDF(data: ScheduleWithItems): Promise<Buffer>;
}
