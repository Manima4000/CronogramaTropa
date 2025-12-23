// Entity seguindo princípios do DDD
export class Schedule {
  constructor(
    public readonly id: number,
    public title: string,
    public description: string | null,
    public courseId: number,
    public startDate: Date,
    public endDate: Date,
    public studyDaysPerWeek: number,
    public hoursPerDay: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
