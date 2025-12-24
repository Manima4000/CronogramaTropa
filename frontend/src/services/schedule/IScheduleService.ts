import type { CreateScheduleRequestDTO } from '../../dtos/schedule/CreateScheduleRequestDTO';
import type { ScheduleDTO } from '../../dtos/schedule/ScheduleDTO';
import type { ScheduleWithItemsDTO } from '../../dtos/schedule/ScheduleWithItemsDTO';

// Interface Segregation Principle: Clients depend on specific methods they use
export interface IScheduleService {
  create(data: CreateScheduleRequestDTO): Promise<ScheduleWithItemsDTO>;
  getById(id: number): Promise<ScheduleWithItemsDTO>;
  list(): Promise<ScheduleDTO[]>;
  delete(id: number): Promise<void>;
  exportToPDF(id: number): Promise<Blob>;
}
