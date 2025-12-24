import { ILessonRepository } from '../repositories/ILessonRepository';

export class GetLessonsWithVideosBySectionIdUseCase {
  constructor(private lessonRepository: ILessonRepository) {}

  async execute(sectionId: number): Promise<any[]> {
    return await this.lessonRepository.findBySectionIdWithVideos(sectionId);
  }
}
