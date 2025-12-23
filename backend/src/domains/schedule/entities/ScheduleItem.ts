export class ScheduleItem {
  constructor(
    public readonly id: string,
    public scheduleId: string,
    public lessonId: string,
    public scheduledDate: Date,
    public duration: number,
    public completed: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
