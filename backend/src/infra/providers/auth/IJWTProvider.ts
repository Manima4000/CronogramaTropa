export interface JWTPayload {
  userId: number;
  email: string;
  role: 'admin' | 'user';
}

// Provider interface for JWT operations
export interface IJWTProvider {
  sign(payload: JWTPayload): Promise<string>;
  verify(token: string): Promise<JWTPayload>;
}
