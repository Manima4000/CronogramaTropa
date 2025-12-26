import { IScheduleRepository } from '../repositories/IScheduleRepository';
import { IScheduleItemRepository } from '../repositories/IScheduleItemRepository';
import { ILessonRepository } from '../../lesson/repositories/ILessonRepository';
import { ISectionRepository } from '../../section/repositories/ISectionRepository';
import { ICourseRepository } from '../../course/repositories/ICourseRepository';
import { IPDFProvider, ScheduleItemWithLesson } from '../../../shared/interfaces/IPDFProvider';

// Single Responsibility Principle (S do SOLID)
// Dependency Inversion Principle (D do SOLID)
export class ExportScheduleToPDFUseCase {
  constructor(
    private scheduleRepository: IScheduleRepository,
    private scheduleItemRepository: IScheduleItemRepository,
    private lessonRepository: ILessonRepository,
    private sectionRepository: ISectionRepository,
    private courseRepository: ICourseRepository,
    private pdfProvider: IPDFProvider
  ) {}

  async execute(scheduleId: number): Promise<Buffer> {
    const schedule = await this.scheduleRepository.findById(scheduleId);

    if (!schedule) {
      throw new Error('Schedule not found');
    }

    const items = await this.scheduleItemRepository.findByScheduleId(scheduleId);

    // Buscar lessons, sections e courses de todos os items
    const itemsWithLessons: ScheduleItemWithLesson[] = await Promise.all(
      items.map(async (item) => {
        const lesson = await this.lessonRepository.findById(item.lessonId);

        if (!lesson) {
          throw new Error(`Lesson ${item.lessonId} not found for schedule item ${item.id}`);
        }

        const section = await this.sectionRepository.findById(lesson.sectionId);

        if (!section) {
          throw new Error(`Section ${lesson.sectionId} not found for lesson ${lesson.id}`);
        }

        const course = await this.courseRepository.findById(section.courseId);

        if (!course) {
          throw new Error(`Course ${section.courseId} not found for section ${section.id}`);
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
          section,
          course,
        };
      })
    );

    return await this.pdfProvider.generateSchedulePDF({
      schedule,
      items: itemsWithLessons,
    });
  }
}
