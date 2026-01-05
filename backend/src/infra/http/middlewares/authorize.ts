import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../shared/errors/AppError';

// Middleware factory for role-based authorization
export const authorize = (...allowedRoles: ('admin' | 'user')[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const hasPermission = allowedRoles.includes(req.user.role);

      if (!hasPermission) {
        throw new AppError('Insufficient permissions', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
