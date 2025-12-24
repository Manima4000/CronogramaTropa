export interface ScheduleItemDTO {
  id: number;
  scheduleId: number;
  lessonId: number;
  scheduledDate: string; // ISO 8601 datetime string
  duration: number; // minutes
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
