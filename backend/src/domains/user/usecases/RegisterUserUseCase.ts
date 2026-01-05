import { IUserRepository } from '../repositories/IUserRepository';
import { IHashProvider } from '../../../infra/providers/auth/IHashProvider';
import { User } from '../entities/User';
import { AppError } from '../../../shared/errors/AppError';

export interface RegisterUserInput {
  email: string;
  password: string;
  role: 'admin' | 'user';
}

// Single Responsibility: Handle user registration
export class RegisterUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private hashProvider: IHashProvider
  ) {}

  async execute(input: RegisterUserInput): Promise<User> {
    // 1. Check if email already exists
    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new AppError('Email already in use', 409);
    }

    // 2. Validate password strength
    if (!input.password || input.password.length < 6) {
      throw new AppError('Password must be at least 6 characters long', 400);
    }

    // 3. Hash password
    const passwordHash = await this.hashProvider.hash(input.password);

    // 4. Create user
    const user = await this.userRepository.create({
      email: input.email,
      passwordHash,
      role: input.role,
    });

    return user;
  }
}
