// Provider interface for password hashing
export interface IHashProvider {
  hash(payload: string): Promise<string>;
  compare(payload: string, hashed: string): Promise<boolean>;
}
