// Entity seguindo princípios do DDD
export class Section {
  constructor(
    public readonly id: number,
    public name: string,
    public slug: string,
    public position: number,
    public courseId: number
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Section name cannot be empty');
    }
    if (!this.slug || this.slug.trim().length === 0) {
      throw new Error('Section slug cannot be empty');
    }
    if (this.position < 0) {
      throw new Error('Section position cannot be negative');
    }
  }

  public updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Section name cannot be empty');
    }
    this.name = name;
  }

  public updateSlug(slug: string): void {
    if (!slug || slug.trim().length === 0) {
      throw new Error('Section slug cannot be empty');
    }
    this.slug = slug;
  }
}
