export interface Classroom {
  id: number;
  name: string;
  courseName: string;
  userCount: number;
}

export interface IClassroomRepository {
  create(classroom: Classroom): Promise<Classroom>;
  createMany(classrooms: Classroom[]): Promise<void>;
  findAll(): Promise<Classroom[]>;
  findById(id: number): Promise<Classroom | null>;
  update(id: number, data: Partial<Classroom>): Promise<Classroom>;
  delete(id: number): Promise<void>;
}
