import { Request, Response, NextFunction } from 'express';
import { JWTProvider } from '../../providers/auth/JWTProvider';
import { AppError } from '../../../shared/errors/AppError';

const jwtProvider = new JWTProvider();

// Middleware to verify JWT from httpOnly cookie
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. Extract token from cookie
    const token = req.cookies?.authToken;

    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    // 2. Verify token
    const payload = await jwtProvider.verify(token);

    // 3. Attach user to request
    req.user = payload;

    next();
  } catch (error) {
    next(error);
  }
};
