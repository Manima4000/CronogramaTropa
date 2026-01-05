import bcrypt from 'bcryptjs';
import { IHashProvider } from './IHashProvider';

export class BcryptHashProvider implements IHashProvider {
  private readonly saltRounds = 10;

  async hash(payload: string): Promise<string> {
    return bcrypt.hash(payload, this.saltRounds);
  }

  async compare(payload: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(payload, hashed);
  }
}
