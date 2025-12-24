import { ILessonRepository } from '../repositories/ILessonRepository';
import { Lesson } from '../entities/Lesson';

export class GetLessonsBySectionIdUseCase {
  constructor(private lessonRepository: ILessonRepository) {}

  async execute(sectionId: number): Promise<Lesson[]> {
    return await this.lessonRepository.findBySectionId(sectionId);
  }
}
