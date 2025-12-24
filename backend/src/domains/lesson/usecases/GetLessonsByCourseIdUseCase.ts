import { ILessonRepository } from '../repositories/ILessonRepository';
import { ISectionRepository } from '../../section/repositories/ISectionRepository';
import { Lesson } from '../entities/Lesson';

export class GetLessonsByCourseIdUseCase {
  constructor(
    private lessonRepository: ILessonRepository,
    private sectionRepository: ISectionRepository
  ) {}

  async execute(courseId: number): Promise<Lesson[]> {
    // 1. Buscar todas as sections do curso
    const sections = await this.sectionRepository.findByCourseId(courseId);

    // 2. Buscar todas as lessons de cada section
    const allLessons: Lesson[] = [];

    for (const section of sections) {
      const lessons = await this.lessonRepository.findBySectionId(section.id);
      allLessons.push(...lessons);
    }

    // 3. Ordenar por position (já que as lessons vêm de diferentes sections)
    return allLessons.sort((a, b) => a.position - b.position);
  }
}
