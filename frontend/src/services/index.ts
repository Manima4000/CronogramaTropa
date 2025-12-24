import { httpClient } from './api/httpClient';
import { ScheduleService } from './schedule/ScheduleService';

// Service instances (can be replaced with DI container later)
export const scheduleService = new ScheduleService(httpClient);

// Export interfaces for testing/mocking
export type { IScheduleService } from './schedule/IScheduleService';
