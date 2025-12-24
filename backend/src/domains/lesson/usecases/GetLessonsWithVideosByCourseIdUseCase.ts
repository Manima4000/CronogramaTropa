import { ILessonRepository } from '../repositories/ILessonRepository';

export class GetLessonsWithVideosByCourseIdUseCase {
  constructor(private lessonRepository: ILessonRepository) {}

  async execute(courseId: number): Promise<any[]> {
    return await this.lessonRepository.findByCourseIdWithVideos(courseId);
  }
}
