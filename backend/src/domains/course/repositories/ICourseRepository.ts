import { Course } from '../entities/Course';

export interface ICourseRepository {
  create(course: Course): Promise<Course>;
  createMany(courses: Course[]): Promise<void>;
  findAll(): Promise<Course[]>;
  findById(id: number): Promise<Course | null>;
  update(id: number, data: Partial<Course>): Promise<Course>;
  delete(id: number): Promise<void>;
}
