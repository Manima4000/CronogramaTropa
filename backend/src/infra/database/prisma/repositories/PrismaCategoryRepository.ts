import { ICategoryRepository, Category } from '../../../../domains/category/repositories/ICategoryRepository';
import { prisma } from '../prisma';

export class PrismaCategoryRepository implements ICategoryRepository {
  async create(category: Category): Promise<Category> {
    return await prisma.category.create({
      data: category,
    });
  }

  async createMany(categories: Category[]): Promise<void> {
    await prisma.category.createMany({
      data: categories,
      skipDuplicates: true,
    });
  }

  async findAll(): Promise<Category[]> {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: number): Promise<Category | null> {
    return await prisma.category.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: Partial<Category>): Promise<Category> {
    return await prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.category.delete({
      where: { id },
    });
  }
}
