import { IScheduleItemRepository } from '../../../../domains/schedule/repositories/IScheduleItemRepository';
import { ScheduleItem } from '../../../../domains/schedule/entities/ScheduleItem';
import { prisma } from '../prisma';

export class PrismaScheduleItemRepository implements IScheduleItemRepository {
  async create(data: Omit<ScheduleItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ScheduleItem> {
    const item = await prisma.scheduleItem.create({
      data: {
        scheduleId: data.scheduleId,
        lessonId: data.lessonId,
        scheduledDate: data.scheduledDate,
        startTime: data.startTime,
        duration: data.duration,
        completed: data.completed,
      },
    });

    return new ScheduleItem(
      item.id,
      item.scheduleId,
      item.lessonId,
      item.scheduledDate,
      item.startTime,
      item.duration,
      item.completed,
      item.createdAt,
      item.updatedAt
    );
  }

  async createMany(items: Omit<ScheduleItem, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<void> {
    await prisma.scheduleItem.createMany({
      data: items.map((item) => ({
        scheduleId: item.scheduleId,
        lessonId: item.lessonId,
        scheduledDate: item.scheduledDate,
        startTime: item.startTime,
        duration: item.duration,
        completed: item.completed,
      })),
    });
  }

  async findByScheduleId(scheduleId: number): Promise<ScheduleItem[]> {
    const items = await prisma.scheduleItem.findMany({
      where: { scheduleId },
      orderBy: { scheduledDate: 'asc' },
    });

    return items.map(
      (item) =>
        new ScheduleItem(
          item.id,
          item.scheduleId,
          item.lessonId,
          item.scheduledDate,
          item.startTime,
          item.duration,
          item.completed,
          item.createdAt,
          item.updatedAt
        )
    );
  }

  async updateCompletion(id: number, completed: boolean): Promise<ScheduleItem> {
    const item = await prisma.scheduleItem.update({
      where: { id },
      data: { completed },
    });

    return new ScheduleItem(
      item.id,
      item.scheduleId,
      item.lessonId,
      item.scheduledDate,
      item.startTime,
      item.duration,
      item.completed,
      item.createdAt,
      item.updatedAt
    );
  }

  async deleteByScheduleId(scheduleId: number): Promise<void> {
    await prisma.scheduleItem.deleteMany({
      where: { scheduleId },
    });
  }
}
