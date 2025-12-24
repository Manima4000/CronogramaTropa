import { httpClient } from './api/httpClient';
import { ScheduleService } from './schedule/ScheduleService';
import { CourseService } from './course/CourseService';

// Service instances (can be replaced with DI container later)
export const scheduleService = new ScheduleService(httpClient);
export const courseService = new CourseService(httpClient);

// Export interfaces for testing/mocking
export type { IScheduleService } from './schedule/IScheduleService';
export type { ICourseService } from './course/ICourseService';
