// Entity seguindo princípios do DDD
export class Schedule {
  constructor(
    public readonly id: number,
    public title: string,
    public description: string | null,
    public courseId: number | null,
    public startDate: Date,
    public endDate: Date,
    public studyDaysPerWeek: number,
    public hoursPerDay: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.title || this.title.trim().length === 0) {
      throw new Error('Schedule title cannot be empty');
    }

    if (this.studyDaysPerWeek < 1 || this.studyDaysPerWeek > 7) {
      throw new Error('Study days per week must be between 1 and 7');
    }

    if (this.hoursPerDay < 1) {
      throw new Error('Hours per day must be at least 1');
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

  public updateStudyDaysPerWeek(days: number): void {
    if (days < 1 || days > 7) {
      throw new Error('Study days per week must be between 1 and 7');
    }
    this.studyDaysPerWeek = days;
  }

  public updateHoursPerDay(hours: number): void {
    if (hours < 1) {
      throw new Error('Hours per day must be at least 1');
    }
    this.hoursPerDay = hours;
  }

  public getDurationInDays(): number {
    const diffTime = Math.abs(this.endDate.getTime() - this.startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  public getTotalStudyDays(): number {
    const totalDays = this.getDurationInDays();
    const weeksCount = Math.ceil(totalDays / 7);
    return weeksCount * this.studyDaysPerWeek;
  }

  public getTotalStudyHours(): number {
    return this.getTotalStudyDays() * this.hoursPerDay;
  }
}
