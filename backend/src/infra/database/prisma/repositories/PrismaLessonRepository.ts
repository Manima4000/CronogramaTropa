import { ILessonRepository } from '../../../../domains/lesson/repositories/ILessonRepository';
import { Lesson } from '../../../../domains/lesson/entities/Lesson';
import { prisma } from '../prisma';

export class PrismaLessonRepository implements ILessonRepository {
  async create(lesson: Lesson): Promise<Lesson> {
    const created = await prisma.lesson.upsert({
      where: { id: lesson.id },
      update: {
        title: lesson.title,
        slug: lesson.slug,
        position: lesson.position,
        sectionId: lesson.sectionId,
      },
      create: {
        id: lesson.id,
        title: lesson.title,
        slug: lesson.slug,
        position: lesson.position,
        sectionId: lesson.sectionId,
      },
    });
    return new Lesson(
      created.id,
      created.title,
      created.slug,
      created.position,
      created.sectionId
    );
  }

  async createMany(lessons: Lesson[]): Promise<void> {
    await prisma.lesson.createMany({
      data: lessons.map(l => ({
        id: l.id,
        title: l.title,
        slug: l.slug,
        position: l.position,
        sectionId: l.sectionId,
      })),
      skipDuplicates: true,
    });
  }

  async findAll(): Promise<Lesson[]> {
    const lessons = await prisma.lesson.findMany({
      orderBy: { position: 'asc' },
    });
    return lessons.map(l => new Lesson(
      l.id,
      l.title,
      l.slug,
      l.position,
      l.sectionId
    ));
  }

  async findById(id: number): Promise<Lesson | null> {
    const lesson = await prisma.lesson.findUnique({
      where: { id },
    });
    return lesson ? new Lesson(
      lesson.id,
      lesson.title,
      lesson.slug,
      lesson.position,
      lesson.sectionId
    ) : null;
  }

  async findBySectionId(sectionId: number): Promise<Lesson[]> {
    const lessons = await prisma.lesson.findMany({
      where: { sectionId },
      orderBy: { position: 'asc' },
    });
    return lessons.map(l => new Lesson(
      l.id,
      l.title,
      l.slug,
      l.position,
      l.sectionId
    ));
  }

  async update(id: number, data: Partial<Lesson>): Promise<Lesson> {
    const updated = await prisma.lesson.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        position: data.position,
        sectionId: data.sectionId,
      },
    });
    return new Lesson(
      updated.id,
      updated.title,
      updated.slug,
      updated.position,
      updated.sectionId
    );
  }

  async delete(id: number): Promise<void> {
    await prisma.lesson.delete({
      where: { id },
    });
  }
}
