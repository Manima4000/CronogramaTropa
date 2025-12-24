// Entity seguindo princípios do DDD
export class Lesson {
  constructor(
    public readonly id: number,
    public title: string,
    public slug: string,
    public position: number,
    public sectionId: number
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.title || this.title.trim().length === 0) {
      throw new Error('Lesson title cannot be empty');
    }
    if (!this.slug || this.slug.trim().length === 0) {
      throw new Error('Lesson slug cannot be empty');
    }
    if (this.position < 0) {
      throw new Error('Lesson position cannot be negative');
    }
  }

  public updateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new Error('Lesson title cannot be empty');
    }
    this.title = title;
  }

  public updateSlug(slug: string): void {
    if (!slug || slug.trim().length === 0) {
      throw new Error('Lesson slug cannot be empty');
    }
    this.slug = slug;
  }
}
