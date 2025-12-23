export interface Course {
  id: string;
  name: string;
  position: number;
  description: string | null;
  image: string | null;
  url: string | null;
}

export interface ICourseRepository {
  create(course: Course): Promise<Course>;
  createMany(courses: Course[]): Promise<void>;
  findAll(): Promise<Course[]>;
  findById(id: string): Promise<Course | null>;
  update(id: string, data: Partial<Course>): Promise<Course>;
  delete(id: string): Promise<void>;
}
