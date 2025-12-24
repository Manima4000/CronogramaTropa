export interface CreateScheduleRequestDTO {
  title: string;
  description?: string | null;
  courseId?: number | null;
  startDate: string; // ISO 8601 date
  endDate: string;   // ISO 8601 date
  studyDaysPerWeek: number; // 1-7
  hoursPerDay: number;      // >= 1
  items: ScheduleItemInputDTO[];
}

export interface ScheduleItemInputDTO {
  lessonId: number;
  scheduledDate: string; // ISO 8601
  startTime: string; // HH:mm
  duration: number; // em minutos
}
