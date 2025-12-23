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
  ) {}
}
