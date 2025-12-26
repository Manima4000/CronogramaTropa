import { IScheduleRepository } from '../repositories/IScheduleRepository';
import { IScheduleItemRepository } from '../repositories/IScheduleItemRepository';
import { ILessonRepository } from '../../lesson/repositories/ILessonRepository';
import { Schedule } from '../entities/Schedule';
import { ScheduleItem } from '../entities/ScheduleItem';
import { Lesson } from '../../lesson/entities/Lesson';

// DTO com informações enriquecidas para o frontend
export interface ScheduleItemWithLesson {
  id: number;
  scheduleId: number;
  lessonId: number;
  scheduledDate: Date;
  startTime: string;
  duration: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  lesson: Lesson;
}

export interface GetScheduleByIdOutput {
  schedule: Schedule;
  items: ScheduleItemWithLesson[];
}

// Single Responsibility Principle (S do SOLID)
// Responsabilidade: Orquestrar a busca de um cronograma com todos os seus detalhes
export class GetScheduleByIdUseCase {
  constructor(
    private scheduleRepository: IScheduleRepository,
    private scheduleItemRepository: IScheduleItemRepository,
    private lessonRepository: ILessonRepository
  ) {}

  async execute(id: number): Promise<GetScheduleByIdOutput | null> {
    // 1. Buscar schedule
    const schedule = await this.scheduleRepository.findById(id);

    if (!schedule) {
      return null;
    }

    // 2. Buscar items do schedule
    const items = await this.scheduleItemRepository.findByScheduleId(id);

    // 3. Buscar lessons de todos os items (em paralelo para performance)
    const itemsWithLessons = await Promise.all(
      items.map(async (item) => {
        const lesson = await this.lessonRepository.findById(item.lessonId);

        // Se lesson não existir, isso é um erro de integridade
        if (!lesson) {
          throw new Error(`Lesson ${item.lessonId} not found for schedule item ${item.id}`);
        }

        return {
          id: item.id,
          scheduleId: item.scheduleId,
          lessonId: item.lessonId,
          scheduledDate: item.scheduledDate,
          startTime: item.startTime,
          duration: item.duration,
          completed: item.completed,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          lesson,
        };
      })
    );

    return {
      schedule,
      items: itemsWithLessons,
    };
  }
}
