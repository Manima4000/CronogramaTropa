import { IScheduleRepository } from '../repositories/IScheduleRepository';
import { IScheduleItemRepository } from '../repositories/IScheduleItemRepository';
import { ICourseRepository } from '../../course/repositories/ICourseRepository';
import { ILessonRepository } from '../../lesson/repositories/ILessonRepository';
import { Schedule } from '../entities/Schedule';
import { AppError } from '../../../shared/errors/AppError';

// DTO para item do cronograma (lesson + data agendada + hora)
export interface ScheduleItemInput {
  lessonId: number;
  scheduledDate: Date;
  startTime: string; // Formato HH:mm (ex: "14:30")
  duration: number; // duração em minutos
}

// DTO para criação de cronograma
export interface CreateScheduleInput {
  title: string;
  description: string | null;
  courseId?: number | null;
  startDate: Date;
  endDate: Date;
  studyDaysPerWeek: number;
  hoursPerDay: number;
  items: ScheduleItemInput[];
}

// Single Responsibility Principle (S do SOLID)
// Cada Use Case tem UMA responsabilidade específica - orquestrar a criação do cronograma
export class CreateScheduleUseCase {
  constructor(
    private scheduleRepository: IScheduleRepository,
    private scheduleItemRepository: IScheduleItemRepository,
    private courseRepository: ICourseRepository,
    private lessonRepository: ILessonRepository
  ) {}

  async execute(input: CreateScheduleInput): Promise<Schedule> {
    // 1. Validar se há items
    if (!input.items || input.items.length === 0) {
      throw new AppError('At least one lesson must be scheduled', 400);
    }

    // 3. Validar se todas as lessons existem
    const lessonIds = input.items.map((item) => item.lessonId);
    const lessonsPromises = lessonIds.map((id) =>
      this.lessonRepository.findById(id)
    );
    const lessons = await Promise.all(lessonsPromises);

    const notFoundLessons = lessons
      .map((lesson, index) => ({ lesson, id: lessonIds[index] }))
      .filter((item) => !item.lesson);

    if (notFoundLessons.length > 0) {
      const ids = notFoundLessons.map((item) => item.id).join(', ');
      throw new AppError(`Lessons not found: ${ids}`, 404);
    }

    // 3. Criar o schedule (validações da entidade Schedule serão executadas no construtor)
    const schedule = await this.scheduleRepository.create({
      title: input.title,
      description: input.description,
      courseId: input.courseId ?? null,
      startDate: input.startDate,
      endDate: input.endDate,
      studyDaysPerWeek: input.studyDaysPerWeek,
      hoursPerDay: input.hoursPerDay,
    });

    // 5. Criar os schedule items (validações da entidade ScheduleItem serão executadas no construtor)
    await this.scheduleItemRepository.createMany(
      input.items.map((item) => ({
        scheduleId: schedule.id,
        lessonId: item.lessonId,
        scheduledDate: item.scheduledDate,
        startTime: item.startTime,
        duration: item.duration,
        completed: false,
      }))
    );

    return schedule;
  }
}

