import { ICourseRepository } from '../../../../domains/course/repositories/ICourseRepository';
import { Course } from '../../../../domains/course/entities/Course';
import { prisma } from '../prisma';

export class PrismaCourseRepository implements ICourseRepository {
  async create(course: Course): Promise<Course> {
    const created = await prisma.course.create({
      data: {
        id: course.id,
        name: course.name,
        position: course.position,
        description: course.description,
        imageUrl: course.imageUrl,
        categoryId: course.categoryId,
      },
    });
    return new Course(
      created.id,
      created.name,
      created.position,
      created.description,
      created.imageUrl,
      created.categoryId
    );
  }

  async createMany(courses: Course[]): Promise<void> {
    await prisma.course.createMany({
      data: courses.map(c => ({
        id: c.id,
        name: c.name,
        position: c.position,
        description: c.description,
        imageUrl: c.imageUrl,
        categoryId: c.categoryId,
      })),
      skipDuplicates: true,
    });
  }

  async findAll(): Promise<Course[]> {
    const courses = await prisma.course.findMany({
      orderBy: { position: 'asc' },
    });
    return courses.map(c => new Course(
      c.id,
      c.name,
      c.position,
      c.description,
      c.imageUrl,
      c.categoryId
    ));
  }

  async findById(id: number): Promise<Course | null> {
    const course = await prisma.course.findUnique({
      where: { id },
    });
    return course ? new Course(
      course.id,
      course.name,
      course.position,
      course.description,
      course.imageUrl,
      course.categoryId
    ) : null;
  }

  async update(id: number, data: Partial<Course>): Promise<Course> {
    const updated = await prisma.course.update({
      where: { id },
      data: {
        name: data.name,
        position: data.position,
        description: data.description,
        imageUrl: data.imageUrl,
        categoryId: data.categoryId,
      },
    });
    return new Course(
      updated.id,
      updated.name,
      updated.position,
      updated.description,
      updated.imageUrl,
      updated.categoryId
    );
  }

  async delete(id: number): Promise<void> {
    await prisma.course.delete({
      where: { id },
    });
  }
}
