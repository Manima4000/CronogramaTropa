// Entity seguindo princípios do DDD
export class Schedule {
  constructor(
    public readonly id: string,
    public title: string,
    public description: string | null,
    public courseId: string,
    public startDate: Date,
    public endDate: Date,
    public studyDaysPerWeek: number,
    public hoursPerDay: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
