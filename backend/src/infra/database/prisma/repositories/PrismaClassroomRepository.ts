import { IClassroomRepository } from '../../../../domains/classroom/repositories/IClassroomRepository';
import { Classroom } from '../../../../domains/classroom/entities/Classroom';
import { prisma } from '../prisma';

export class PrismaClassroomRepository implements IClassroomRepository {
  async create(classroom: Classroom): Promise<Classroom> {
    const created = await prisma.classroom.create({
      data: {
        id: classroom.id,
        name: classroom.name,
        courseName: classroom.courseName,
        userCount: classroom.userCount,
      },
    });
    return new Classroom(
      created.id,
      created.name,
      created.courseName,
      created.userCount
    );
  }

  async createMany(classrooms: Classroom[]): Promise<void> {
    await prisma.classroom.createMany({
      data: classrooms.map(c => ({
        id: c.id,
        name: c.name,
        courseName: c.courseName,
        userCount: c.userCount,
      })),
      skipDuplicates: true,
    });
  }

  async findAll(): Promise<Classroom[]> {
    const classrooms = await prisma.classroom.findMany({
      orderBy: { name: 'asc' },
    });
    return classrooms.map(c => new Classroom(
      c.id,
      c.name,
      c.courseName,
      c.userCount
    ));
  }

  async findById(id: number): Promise<Classroom | null> {
    const classroom = await prisma.classroom.findUnique({
      where: { id },
    });
    return classroom ? new Classroom(
      classroom.id,
      classroom.name,
      classroom.courseName,
      classroom.userCount
    ) : null;
  }

  async update(id: number, data: Partial<Classroom>): Promise<Classroom> {
    const updated = await prisma.classroom.update({
      where: { id },
      data: {
        name: data.name,
        courseName: data.courseName,
        userCount: data.userCount,
      },
    });
    return new Classroom(
      updated.id,
      updated.name,
      updated.courseName,
      updated.userCount
    );
  }

  async delete(id: number): Promise<void> {
    await prisma.classroom.delete({
      where: { id },
    });
  }
}
