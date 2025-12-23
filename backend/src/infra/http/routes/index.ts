import { Router } from 'express';
import scheduleRoutes from './schedule.routes';
import syncRoutes from './sync.routes';

const routes = Router();

routes.use('/schedules', scheduleRoutes);
routes.use('/sync', syncRoutes);

// Adicionar outras rotas aqui
// routes.use('/courses', courseRoutes);
// routes.use('/lessons', lessonRoutes);

export default routes;
