// Entity seguindo princípios do DDD
export class Schedule {
  constructor(
    public readonly id: number,
    public title: string,
    public description: string | null,
    public courseId: number | null,
    public startDate: Date,
    public endDate: Date,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.title || this.title.trim().length === 0) {
      throw new Error('Schedule title cannot be empty');
    }

    if (this.startDate >= this.endDate) {
      throw new Error('Start date must be before end date');
    }
  }

  public updateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new Error('Schedule title cannot be empty');
    }
    this.title = title;
  }

  public updateDescription(description: string | null): void {
    this.description = description;
  }

  public getDurationInDays(): number {
    const diffTime = Math.abs(this.endDate.getTime() - this.startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
}
