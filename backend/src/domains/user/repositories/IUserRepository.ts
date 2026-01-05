import { User } from '../entities/User';

export interface CreateUserData {
  email: string;
  passwordHash: string;
  role: 'admin' | 'user';
}

export interface UpdateUserData {
  email?: string;
  role?: 'admin' | 'user';
}

// Interface Segregation Principle (I do SOLID)
export interface IUserRepository {
  create(data: CreateUserData): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: number, data: UpdateUserData): Promise<User>;
  delete(id: number): Promise<void>;
}
