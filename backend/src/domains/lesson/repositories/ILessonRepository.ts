export interface Lesson {
  id: string;
  name: string;
  slug: string;
  position: number;
  sectionId: string;
}

export interface ILessonRepository {
  create(lesson: Lesson): Promise<Lesson>;
  createMany(lessons: Lesson[]): Promise<void>;
  findAll(): Promise<Lesson[]>;
  findById(id: string): Promise<Lesson | null>;
  findBySectionId(sectionId: string): Promise<Lesson[]>;
}
