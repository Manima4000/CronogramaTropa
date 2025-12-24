export class ScheduleItem {
  constructor(
    public readonly id: number,
    public scheduleId: number,
    public lessonId: number,
    public scheduledDate: Date,
    public duration: number,
    public completed: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.duration < 1) {
      throw new Error('Schedule item duration must be at least 1 minute');
    }
  }

  public markAsCompleted(): void {
    this.completed = true;
  }

  public markAsIncomplete(): void {
    this.completed = false;
  }

  public updateDuration(duration: number): void {
    if (duration < 1) {
      throw new Error('Schedule item duration must be at least 1 minute');
    }
    this.duration = duration;
  }

  public updateScheduledDate(date: Date): void {
    this.scheduledDate = date;
  }

  public getDurationInHours(): number {
    return Math.floor(this.duration / 60);
  }

  public getDurationInMinutes(): number {
    return this.duration % 60;
  }

  public isOverdue(currentDate: Date = new Date()): boolean {
    return !this.completed && this.scheduledDate < currentDate;
  }
}
