import { IScheduleRepository } from '../repositories/IScheduleRepository';
import { IScheduleItemRepository } from '../repositories/IScheduleItemRepository';

// Single Responsibility Principle (S do SOLID)
export class DeleteScheduleUseCase {
  constructor(
    private scheduleRepository: IScheduleRepository,
    private scheduleItemRepository: IScheduleItemRepository
  ) {}

  async execute(id: number): Promise<void> {
    // Deletar itens do cronograma primeiro (cascade pode fazer isso automaticamente)
    await this.scheduleItemRepository.deleteByScheduleId(id);

    // Deletar o cronograma
    await this.scheduleRepository.delete(id);
  }
}
