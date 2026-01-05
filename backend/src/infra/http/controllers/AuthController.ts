import { Request, Response, NextFunction } from 'express';
import { AuthenticateUserUseCase } from '../../../domains/user/usecases/AuthenticateUserUseCase';
import { RegisterUserUseCase } from '../../../domains/user/usecases/RegisterUserUseCase';
import { GetUserByIdUseCase } from '../../../domains/user/usecases/GetUserByIdUseCase';
import { AppError } from '../../../shared/errors/AppError';

// Dependency Inversion Principle (D do SOLID)
export class AuthController {
  constructor(
    private authenticateUserUseCase: AuthenticateUserUseCase,
    private registerUserUseCase: RegisterUserUseCase,
    private getUserByIdUseCase: GetUserByIdUseCase
  ) {}

  async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError('Email and password are required', 400);
      }

      const result = await this.authenticateUserUseCase.execute({
        email,
        password,
      });

      // Set httpOnly cookie (secure against XSS)
      res.cookie('authToken', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      });

      // Return user data (no token in body for security)
      return res.json({
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { email, password, role } = req.body;

      if (!email || !password) {
        throw new AppError('Email and password are required', 400);
      }

      const user = await this.registerUserUseCase.execute({
        email,
        password,
        role: role || 'user', // Default to 'user' role
      });

      // Don't return passwordHash
      return res.status(201).json({
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      // Clear cookie
      res.clearCookie('authToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const user = await this.getUserByIdUseCase.execute(req.user.userId);

      // Don't return passwordHash
      return res.json({
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      });
    } catch (error) {
      next(error);
    }
  }
}
