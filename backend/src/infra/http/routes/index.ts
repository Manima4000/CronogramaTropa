import { Router } from 'express';
import scheduleRoutes from './schedule.routes';

const routes = Router();

routes.use('/schedules', scheduleRoutes);

// Adicionar outras rotas aqui
// routes.use('/courses', courseRoutes);
// routes.use('/lessons', lessonRoutes);

export default routes;
