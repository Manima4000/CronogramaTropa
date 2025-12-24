import type { CourseDTO } from '../../dtos/course/CourseDTO';

export interface ICourseService {
  list(): Promise<CourseDTO[]>;
  getById(id: number): Promise<CourseDTO>;
}
