export interface ScheduleDTO {
  id: number;
  title: string;
  description: string | null;
  courseId: number | null;
  startDate: string; // ISO 8601 date string
  endDate: string;   // ISO 8601 date string
  studyDaysPerWeek: number;
  hoursPerDay: number;
  createdAt: string; // ISO 8601 datetime string
  updatedAt: string; // ISO 8601 datetime string
}
