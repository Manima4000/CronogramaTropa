export interface Section {
  id: number;
  name: string;
  slug: string;
  position: number;
  courseId: number;
}

export interface ISectionRepository {
  create(section: Section): Promise<Section>;
  createMany(sections: Section[]): Promise<void>;
  findAll(): Promise<Section[]>;
  findById(id: number): Promise<Section | null>;
  findByCourseId(courseId: number): Promise<Section[]>;
  update(id: number, data: Partial<Section>): Promise<Section>;
  delete(id: number): Promise<void>;
}
