import jwt from 'jsonwebtoken';
import { IJWTProvider, JWTPayload } from './IJWTProvider';
import { AppError } from '../../../shared/errors/AppError';

export class JWTProvider implements IJWTProvider {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || '';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    if (!this.secret) {
      throw new Error('JWT_SECRET environment variable is required');
    }
  }

  async sign(payload: JWTPayload): Promise<string> {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    });
  }

  async verify(token: string): Promise<JWTPayload> {
    try {
      const decoded = jwt.verify(token, this.secret) as JWTPayload;
      return decoded;
    } catch (error) {
      throw new AppError('Invalid or expired token', 401);
    }
  }
}
