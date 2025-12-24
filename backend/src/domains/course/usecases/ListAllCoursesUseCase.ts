import { ICourseRepository } from '../repositories/ICourseRepository';
import { Course } from '../entities/Course';

export class ListAllCoursesUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  async execute(): Promise<Course[]> {
    return await this.courseRepository.findAll();
  }
}
