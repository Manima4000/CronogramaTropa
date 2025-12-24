// Entity seguindo princípios do DDD
export class Category {
  constructor(
    public readonly id: number,
    public name: string
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Category name cannot be empty');
    }
  }

  public updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Category name cannot be empty');
    }
    this.name = name;
  }
}
