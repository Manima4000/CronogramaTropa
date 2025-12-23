import { IClassroomRepository, Classroom } from '../../../../domains/classroom/repositories/IClassroomRepository';
import { prisma } from '../prisma';

export class PrismaClassroomRepository implements IClassroomRepository {
  async create(classroom: Classroom): Promise<Classroom> {
    return await prisma.classroom.create({
      data: classroom,
    });
  }

  async createMany(classrooms: Classroom[]): Promise<void> {
    await prisma.classroom.createMany({
      data: classrooms,
      skipDuplicates: true,
    });
  }

  async findAll(): Promise<Classroom[]> {
    return await prisma.classroom.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: number): Promise<Classroom | null> {
    return await prisma.classroom.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: Partial<Classroom>): Promise<Classroom> {
    return await prisma.classroom.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.classroom.delete({
      where: { id },
    });
  }
}
