import { Schedule } from '../../domains/schedule/entities/Schedule';
import { Lesson } from '../../domains/lesson/entities/Lesson';
import { Section } from '../../domains/section/entities/Section';
import { Course } from '../../domains/course/entities/Course';

export interface ScheduleItemWithLesson {
  id: number;
  scheduleId: number;
  lessonId: number;
  scheduledDate: Date;
  startTime: string;
  duration: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  lesson: Lesson;
  section: Section;
  course: Course;
}

export interface ScheduleWithItems {
  schedule: Schedule;
  items: ScheduleItemWithLesson[];
}

export interface PDFOptions {
  hideScheduledTimes?: boolean;
}

// Dependency Inversion Principle (D do SOLID)
export interface IPDFProvider {
  generateSchedulePDF(data: ScheduleWithItems, options?: PDFOptions): Promise<Buffer>;
}
