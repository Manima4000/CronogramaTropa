export interface Lesson {
  id: number;
  title: string;
  slug: string;
  position: number;
  sectionId: number;
}

export interface ILessonRepository {
  create(lesson: Lesson): Promise<Lesson>;
  createMany(lessons: Lesson[]): Promise<void>;
  findAll(): Promise<Lesson[]>;
  findById(id: number): Promise<Lesson | null>;
  findBySectionId(sectionId: number): Promise<Lesson[]>;
  update(id: number, data: Partial<Lesson>): Promise<Lesson>;
  delete(id: number): Promise<void>;
}
