import { ISectionRepository, Section } from '../../../../domains/section/repositories/ISectionRepository';
import { prisma } from '../prisma';

export class PrismaSectionRepository implements ISectionRepository {
  async create(section: Section): Promise<Section> {
    return await prisma.section.create({
      data: section,
    });
  }

  async createMany(sections: Section[]): Promise<void> {
    await prisma.section.createMany({
      data: sections,
      skipDuplicates: true,
    });
  }

  async findAll(): Promise<Section[]> {
    return await prisma.section.findMany({
      orderBy: { position: 'asc' },
    });
  }

  async findById(id:number): Promise<Section | null> {
    return await prisma.section.findUnique({
      where: { id },
    });
  }

  async findByCourseId(courseId: number): Promise<Section[]> {
    return await prisma.section.findMany({
      where: { courseId },
      orderBy: { position: 'asc' },
    });
  }

  async update(id: number, data: Partial<Section>): Promise<Section> {
    return await prisma.section.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.section.delete({
      where: { id },
    });
  }
}
