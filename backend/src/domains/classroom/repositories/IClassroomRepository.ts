import { Classroom } from '../entities/Classroom';

export interface IClassroomRepository {
  create(classroom: Classroom): Promise<Classroom>;
  createMany(classrooms: Classroom[]): Promise<void>;
  findAll(): Promise<Classroom[]>;
  findById(id: number): Promise<Classroom | null>;
  update(id: number, data: Partial<Classroom>): Promise<Classroom>;
  delete(id: number): Promise<void>;
}
