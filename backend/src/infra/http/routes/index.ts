import { Router } from 'express';
import authRoutes from './auth.routes';
import scheduleRoutes from './schedule.routes';
import syncRoutes from './sync.routes';
import courseRoutes from './course.routes';
import sectionRoutes from './section.routes';
import lessonRoutes from './lesson.routes';

const routes = Router();

// Auth routes (public)
routes.use('/auth', authRoutes);

// Protected routes
routes.use('/schedules', scheduleRoutes);
routes.use('/sync', syncRoutes);
routes.use('/courses', courseRoutes);
routes.use('/sections', sectionRoutes);
routes.use('/lessons', lessonRoutes);

export default routes;
