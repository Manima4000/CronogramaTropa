import { ILessonRepository, Lesson } from '../../../../domains/lesson/repositories/ILessonRepository';
import { prisma } from '../prisma';

export class PrismaLessonRepository implements ILessonRepository {
  async create(lesson: Lesson): Promise<Lesson> {
    return await prisma.lesson.create({
      data: lesson,
    });
  }

  async createMany(lessons: Lesson[]): Promise<void> {
    await prisma.lesson.createMany({
      data: lessons,
      skipDuplicates: true,
    });
  }

  async findAll(): Promise<Lesson[]> {
    return await prisma.lesson.findMany({
      orderBy: { position: 'asc' },
    });
  }

  async findById(id: string): Promise<Lesson | null> {
    return await prisma.lesson.findUnique({
      where: { id },
    });
  }

  async findBySectionId(sectionId: string): Promise<Lesson[]> {
    return await prisma.lesson.findMany({
      where: { sectionId },
      orderBy: { position: 'asc' },
    });
  }
}
