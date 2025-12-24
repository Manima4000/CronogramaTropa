export interface CreateScheduleRequestDTO {
  title: string;
  description?: string | null;
  courseId: number;
  startDate: string; // ISO 8601 date
  endDate: string;   // ISO 8601 date
  studyDaysPerWeek: number; // 1-7
  hoursPerDay: number;      // >= 1
}
