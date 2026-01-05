import { httpClient } from './api/httpClient';
import { ScheduleService } from './schedule/scheduleService';
import { CourseService } from './course/CourseService';
import { LessonService } from './lesson/LessonService';
import { SectionService } from './section/SectionService';

// Service instances (can be replaced with DI container later)
export const scheduleService = new ScheduleService(httpClient);
export const courseService = new CourseService(httpClient);
export const lessonService = new LessonService(httpClient);
export const sectionService = new SectionService(httpClient);

// Export interfaces for testing/mocking
export type { IScheduleService } from './schedule/IScheduleService';
export type { ICourseService } from './course/ICourseService';
export type { ILessonService } from './lesson/ILessonService';
export type { ISectionService } from './section/ISectionService';
