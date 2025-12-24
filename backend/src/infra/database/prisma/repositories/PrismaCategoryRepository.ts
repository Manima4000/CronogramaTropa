import { ICategoryRepository } from '../../../../domains/category/repositories/ICategoryRepository';
import { Category } from '../../../../domains/category/entities/Category';
import { prisma } from '../prisma';

export class PrismaCategoryRepository implements ICategoryRepository {
  async create(category: Category): Promise<Category> {
    const created = await prisma.category.create({
      data: {
        id: category.id,
        name: category.name,
      },
    });
    return new Category(created.id, created.name);
  }

  async createMany(categories: Category[]): Promise<void> {
    await prisma.category.createMany({
      data: categories.map(c => ({
        id: c.id,
        name: c.name,
      })),
      skipDuplicates: true,
    });
  }

  async findAll(): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    return categories.map(c => new Category(c.id, c.name));
  }

  async findById(id: number): Promise<Category | null> {
    const category = await prisma.category.findUnique({
      where: { id },
    });
    return category ? new Category(category.id, category.name) : null;
  }

  async update(id: number, data: Partial<Category>): Promise<Category> {
    const updated = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
      },
    });
    return new Category(updated.id, updated.name);
  }

  async delete(id: number): Promise<void> {
    await prisma.category.delete({
      where: { id },
    });
  }
}
