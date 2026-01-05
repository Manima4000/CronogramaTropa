import { IUserRepository } from '../repositories/IUserRepository';
import { User } from '../entities/User';
import { AppError } from '../../../shared/errors/AppError';

// Single Responsibility: Retrieve user by ID
export class GetUserByIdUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: number): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }
}
