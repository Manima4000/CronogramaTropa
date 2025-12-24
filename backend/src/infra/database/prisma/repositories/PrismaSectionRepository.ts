import { ISectionRepository } from '../../../../domains/section/repositories/ISectionRepository';
import { Section } from '../../../../domains/section/entities/Section';
import { prisma } from '../prisma';

export class PrismaSectionRepository implements ISectionRepository {
  async create(section: Section): Promise<Section> {
    const created = await prisma.section.create({
      data: {
        id: section.id,
        name: section.name,
        slug: section.slug,
        position: section.position,
        courseId: section.courseId,
      },
    });
    return new Section(
      created.id,
      created.name,
      created.slug,
      created.position,
      created.courseId
    );
  }

  async createMany(sections: Section[]): Promise<void> {
    await prisma.section.createMany({
      data: sections.map(s => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        position: s.position,
        courseId: s.courseId,
      })),
      skipDuplicates: true,
    });
  }

  async findAll(): Promise<Section[]> {
    const sections = await prisma.section.findMany({
      orderBy: { position: 'asc' },
    });
    return sections.map(s => new Section(
      s.id,
      s.name,
      s.slug,
      s.position,
      s.courseId
    ));
  }

  async findById(id: number): Promise<Section | null> {
    const section = await prisma.section.findUnique({
      where: { id },
    });
    return section ? new Section(
      section.id,
      section.name,
      section.slug,
      section.position,
      section.courseId
    ) : null;
  }

  async findByCourseId(courseId: number): Promise<Section[]> {
    const sections = await prisma.section.findMany({
      where: { courseId },
      orderBy: { position: 'asc' },
    });
    return sections.map(s => new Section(
      s.id,
      s.name,
      s.slug,
      s.position,
      s.courseId
    ));
  }

  async update(id: number, data: Partial<Section>): Promise<Section> {
    const updated = await prisma.section.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        position: data.position,
        courseId: data.courseId,
      },
    });
    return new Section(
      updated.id,
      updated.name,
      updated.slug,
      updated.position,
      updated.courseId
    );
  }

  async delete(id: number): Promise<void> {
    await prisma.section.delete({
      where: { id },
    });
  }
}
