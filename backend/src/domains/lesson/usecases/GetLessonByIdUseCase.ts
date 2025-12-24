import { ILessonRepository } from '../repositories/ILessonRepository';
import { Lesson } from '../entities/Lesson';
import { AppError } from '../../../shared/errors/AppError';

export class GetLessonByIdUseCase {
  constructor(private lessonRepository: ILessonRepository) {}

  async execute(lessonId: number): Promise<Lesson> {
    const lesson = await this.lessonRepository.findById(lessonId);

    if (!lesson) {
      throw new AppError('Lesson not found', 404);
    }

    return lesson;
  }
}
