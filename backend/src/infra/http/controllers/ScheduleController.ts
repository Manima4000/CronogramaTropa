import { Request, Response, NextFunction } from 'express';
import { CreateScheduleUseCase } from '../../../domains/schedule/usecases/CreateScheduleUseCase';
import { GetScheduleByIdUseCase } from '../../../domains/schedule/usecases/GetScheduleByIdUseCase';
import { ListSchedulesUseCase } from '../../../domains/schedule/usecases/ListSchedulesUseCase';
import { DeleteScheduleUseCase } from '../../../domains/schedule/usecases/DeleteScheduleUseCase';
import { ExportScheduleToPDFUseCase } from '../../../domains/schedule/usecases/ExportScheduleToPDFUseCase';
import { AppError } from '../../../shared/errors/AppError';

// Dependency Inversion Principle (D do SOLID)
// Controller depende das abstrações (use cases), não de implementações concretas
export class ScheduleController {
  constructor(
    private createScheduleUseCase: CreateScheduleUseCase,
    private getScheduleByIdUseCase: GetScheduleByIdUseCase,
    private listSchedulesUseCase: ListSchedulesUseCase,
    private deleteScheduleUseCase: DeleteScheduleUseCase,
    private exportScheduleToPDFUseCase: ExportScheduleToPDFUseCase
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { title, description, courseId, startDate, endDate, items } =
        req.body;

      const schedule = await this.createScheduleUseCase.execute({
        title,
        description,
        courseId: courseId ?? null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        items: items.map((item: any) => ({
          lessonId: item.lessonId,
          scheduledDate: new Date(item.scheduledDate),
          startTime: item.startTime,
          duration: item.duration,
        })),
      });

      return res.status(201).json(schedule);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const schedules = await this.listSchedulesUseCase.execute();
      return res.json(schedules);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.params;

      const result = await this.getScheduleByIdUseCase.execute(Number(id));

      if (!result) {
        throw new AppError('Schedule not found', 404);
      }

      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.params;

      await this.deleteScheduleUseCase.execute(Number(id));

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async exportToPDF(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.params;
      const hideScheduledTimes = req.query.hideScheduledTimes === 'true';

      const pdfBuffer = await this.exportScheduleToPDFUseCase.execute(Number(id), hideScheduledTimes);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=cronograma-${id}.pdf`);

      return res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }
}
