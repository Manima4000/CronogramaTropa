import { IScheduleRepository } from '../repositories/IScheduleRepository';
import { IScheduleItemRepository } from '../repositories/IScheduleItemRepository';
import { ILessonRepository } from '../../lesson/repositories/ILessonRepository';
import { Schedule } from '../entities/Schedule';

interface CreateScheduleInput {
  title: string;
  description?: string;
  courseId: string;
  startDate: Date;
  endDate: Date;
  studyDaysPerWeek: number;
  hoursPerDay: number;
}

// Single Responsibility Principle (S do SOLID)
// Cada Use Case tem UMA responsabilidade específica
export class CreateScheduleUseCase {
  constructor(
    private scheduleRepository: IScheduleRepository,
    private scheduleItemRepository: IScheduleItemRepository,
    private lessonRepository: ILessonRepository
  ) {}

  async execute(input: CreateScheduleInput): Promise<Schedule> {
    // Criar o cronograma
    const schedule = await this.scheduleRepository.create({
      title: input.title,
      description: input.description || null,
      courseId: input.courseId,
      startDate: input.startDate,
      endDate: input.endDate,
      studyDaysPerWeek: input.studyDaysPerWeek,
      hoursPerDay: input.hoursPerDay,
    });

    // Buscar todas as lessons do curso (através das sections)
    // TODO: Implementar lógica de busca de lessons por courseId
    // const lessons = await this.lessonRepository.findByCourseId(input.courseId);

    // Distribuir as aulas nos dias disponíveis
    // TODO: Implementar algoritmo de distribuição de aulas

    return schedule;
  }
}
