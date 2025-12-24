import { IScheduleRepository } from '../repositories/IScheduleRepository';
import { IScheduleItemRepository } from '../repositories/IScheduleItemRepository';
import { ISectionRepository } from '../../section/repositories/ISectionRepository';
import { ILessonRepository } from '../../lesson/repositories/ILessonRepository';
import { IVideoRepository } from '../../video/repositories/IVideoRepository';
import { Schedule } from '../entities/Schedule';
import { AppError } from '../../../shared/errors/AppError';

// Single Responsibility Principle (S do SOLID)
// Cada Use Case tem UMA responsabilidade específica
export class CreateScheduleUseCase {
  constructor(
    private scheduleRepository: IScheduleRepository,
    private scheduleItemRepository: IScheduleItemRepository,
    private sectionRepository: ISectionRepository,
    private lessonRepository: ILessonRepository,
    private videoRepository: IVideoRepository
  ) {}
}

