import { ICourseRepository, Course } from '../../../../domains/course/repositories/ICourseRepository';
import { prisma } from '../prisma';

export class PrismaCourseRepository implements ICourseRepository {
  async create(course: Course): Promise<Course> {
    return await prisma.course.create({
      data: course,
    });
  }

  async createMany(courses: Course[]): Promise<void> {
    await prisma.course.createMany({
      data: courses,
      skipDuplicates: true,
    });
  }

  async findAll(): Promise<Course[]> {
    return await prisma.course.findMany({
      orderBy: { position: 'asc' },
    });
  }

  async findById(id: number): Promise<Course | null> {
    return await prisma.course.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: Partial<Course>): Promise<Course> {
    return await prisma.course.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.course.delete({
      where: { id },
    });
  }
}
