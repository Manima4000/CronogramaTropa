import { IScheduleRepository } from '../repositories/IScheduleRepository';
import { IScheduleItemRepository } from '../repositories/IScheduleItemRepository';
import { IPDFProvider } from '../../../shared/interfaces/IPDFProvider';

// Single Responsibility Principle (S do SOLID)
// Dependency Inversion Principle (D do SOLID)
export class ExportScheduleToPDFUseCase {
  constructor(
    private scheduleRepository: IScheduleRepository,
    private scheduleItemRepository: IScheduleItemRepository,
    private pdfProvider: IPDFProvider
  ) {}

  async execute(scheduleId: string): Promise<Buffer> {
    const schedule = await this.scheduleRepository.findById(scheduleId);

    if (!schedule) {
      throw new Error('Schedule not found');
    }

    const items = await this.scheduleItemRepository.findByScheduleId(scheduleId);

    return await this.pdfProvider.generateSchedulePDF({
      schedule,
      items,
    });
  }
}
