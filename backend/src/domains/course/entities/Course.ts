// Entity seguindo princípios do DDD
export class Course {
  constructor(
    public readonly id: number,
    public name: string,
    public position: number,
    public description: string | null,
    public imageUrl: string | null,
    public categoryId: number
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Course name cannot be empty');
    }
    if (this.position < 0) {
      throw new Error('Course position cannot be negative');
    }
  }

  public updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Course name cannot be empty');
    }
    this.name = name;
  }

  public updateDescription(description: string | null): void {
    this.description = description;
  }

  public updateImageUrl(imageUrl: string | null): void {
    this.imageUrl = imageUrl;
  }
}
