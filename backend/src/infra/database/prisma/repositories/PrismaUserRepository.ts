import {
  IUserRepository,
  CreateUserData,
  UpdateUserData,
} from '../../../../domains/user/repositories/IUserRepository';
import { User } from '../../../../domains/user/entities/User';
import { prisma } from '../prisma';

// Dependency Inversion Principle (D do SOLID)
export class PrismaUserRepository implements IUserRepository {
  async create(data: CreateUserData): Promise<User> {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role,
      },
    });

    return new User(
      user.id,
      user.email,
      user.passwordHash,
      user.role,
      user.createdAt,
      user.updatedAt
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return new User(
      user.id,
      user.email,
      user.passwordHash,
      user.role,
      user.createdAt,
      user.updatedAt
    );
  }

  async findById(id: number): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return new User(
      user.id,
      user.email,
      user.passwordHash,
      user.role,
      user.createdAt,
      user.updatedAt
    );
  }

  async findAll(): Promise<User[]> {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return users.map(
      (u) => new User(u.id, u.email, u.passwordHash, u.role, u.createdAt, u.updatedAt)
    );
  }

  async update(id: number, data: UpdateUserData): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data,
    });

    return new User(
      user.id,
      user.email,
      user.passwordHash,
      user.role,
      user.createdAt,
      user.updatedAt
    );
  }

  async delete(id: number): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }
}
