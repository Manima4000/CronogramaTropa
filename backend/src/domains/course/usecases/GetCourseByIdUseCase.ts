import { ICourseRepository } from '../repositories/ICourseRepository';
import { Course } from '../entities/Course';
import { AppError } from '../../../shared/errors/AppError';

export class GetCourseByIdUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  async execute(courseId: number): Promise<Course> {
    const course = await this.courseRepository.findById(courseId);

    if (!course) {
      throw new AppError('Course not found', 404);
    }

    return course;
  }
}
