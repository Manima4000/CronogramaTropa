import { JWTPayload } from '../../infra/providers/auth/IJWTProvider';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}
