import { Router } from 'express';
import scheduleRoutes from './schedule.routes';
import syncRoutes from './sync.routes';
import courseRoutes from './course.routes';
import sectionRoutes from './section.routes';
import lessonRoutes from './lesson.routes';

const routes = Router();

routes.use('/schedules', scheduleRoutes);
routes.use('/sync', syncRoutes);
routes.use('/courses', courseRoutes);
routes.use('/sections', sectionRoutes);
routes.use('/lessons', lessonRoutes);

export default routes;
