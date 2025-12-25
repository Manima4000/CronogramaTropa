import { IScheduleRepository } from '../../../../domains/schedule/repositories/IScheduleRepository';
import { Schedule } from '../../../../domains/schedule/entities/Schedule';
import { prisma } from '../prisma';

// Dependency Inversion Principle (D do SOLID)
// A implementação depende da interface, não o contrário
export class PrismaScheduleRepository implements IScheduleRepository {
  async create(data: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<Schedule> {
    const schedule = await prisma.schedule.create({
      data: {
        title: data.title,
        description: data.description,
        courseId: data.courseId,
        startDate: data.startDate,
        endDate: data.endDate,
      },
    });

    return new Schedule(
      schedule.id,
      schedule.title,
      schedule.description,
      schedule.courseId,
      schedule.startDate,
      schedule.endDate,
      schedule.createdAt,
      schedule.updatedAt
    );
  }

  async findAll(): Promise<Schedule[]> {
    const schedules = await prisma.schedule.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return schedules.map(
      (s) =>
        new Schedule(
          s.id,
          s.title,
          s.description,
          s.courseId,
          s.startDate,
          s.endDate,
          s.createdAt,
          s.updatedAt
        )
    );
  }

  async findById(id: number): Promise<Schedule | null> {
    const schedule = await prisma.schedule.findUnique({
      where: { id },
    });

    if (!schedule) return null;

    return new Schedule(
      schedule.id,
      schedule.title,
      schedule.description,
      schedule.courseId,
      schedule.startDate,
      schedule.endDate,
      schedule.createdAt,
      schedule.updatedAt
    );
  }

  async update(
    id: number,
    data: Partial<Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Schedule> {
    const schedule = await prisma.schedule.update({
      where: { id },
      data,
    });

    return new Schedule(
      schedule.id,
      schedule.title,
      schedule.description,
      schedule.courseId,
      schedule.startDate,
      schedule.endDate,
      schedule.createdAt,
      schedule.updatedAt
    );
  }

  async delete(id: number): Promise<void> {
    await prisma.schedule.delete({
      where: { id },
    });
  }
}
