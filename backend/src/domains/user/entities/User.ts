export class User {
  constructor(
    public readonly id: number,
    public email: string,
    public readonly passwordHash: string,
    public role: 'admin' | 'user',
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.email || !this.email.trim()) {
      throw new Error('Email cannot be empty');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      throw new Error('Invalid email format');
    }

    if (!this.passwordHash || this.passwordHash.trim().length === 0) {
      throw new Error('Password hash cannot be empty');
    }

    if (this.role !== 'admin' && this.role !== 'user') {
      throw new Error('Invalid role');
    }
  }

  public isAdmin(): boolean {
    return this.role === 'admin';
  }

  public updateEmail(email: string): void {
    if (!email || !email.trim()) {
      throw new Error('Email cannot be empty');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    this.email = email;
  }

  public updateRole(role: 'admin' | 'user'): void {
    if (role !== 'admin' && role !== 'user') {
      throw new Error('Invalid role');
    }
    this.role = role;
  }
}
