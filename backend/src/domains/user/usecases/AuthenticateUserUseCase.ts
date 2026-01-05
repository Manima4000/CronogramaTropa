import { IUserRepository } from '../repositories/IUserRepository';
import { IHashProvider } from '../../../infra/providers/auth/IHashProvider';
import { IJWTProvider } from '../../../infra/providers/auth/IJWTProvider';
import { AppError } from '../../../shared/errors/AppError';

export interface AuthenticateUserInput {
  email: string;
  password: string;
}

export interface AuthenticateUserOutput {
  user: {
    id: number;
    email: string;
    role: 'admin' | 'user';
  };
  token: string;
}

// Single Responsibility: Handle user authentication
export class AuthenticateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private hashProvider: IHashProvider,
    private jwtProvider: IJWTProvider
  ) {}

  async execute(input: AuthenticateUserInput): Promise<AuthenticateUserOutput> {
    // 1. Find user by email
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // 2. Verify password
    const passwordMatches = await this.hashProvider.compare(
      input.password,
      user.passwordHash
    );

    if (!passwordMatches) {
      throw new AppError('Invalid credentials', 401);
    }

    // 3. Generate JWT token (7 days expiration)
    const token = await this.jwtProvider.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // 4. Return user data + token
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
}
