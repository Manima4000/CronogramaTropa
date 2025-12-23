import { Router } from 'express';
import { ScheduleController } from '../controllers/ScheduleController';
import { PrismaScheduleRepository } from '../../database/prisma/repositories/PrismaScheduleRepository';
import { PrismaScheduleItemRepository } from '../../database/prisma/repositories/PrismaScheduleItemRepository';
import { PrismaLessonRepository } from '../../database/prisma/repositories/PrismaLessonRepository';
import { CreateScheduleUseCase } from '../../../domains/schedule/usecases/CreateScheduleUseCase';
import { GetScheduleByIdUseCase } from '../../../domains/schedule/usecases/GetScheduleByIdUseCase';
import { ListSchedulesUseCase } from '../../../domains/schedule/usecases/ListSchedulesUseCase';
import { DeleteScheduleUseCase } from '../../../domains/schedule/usecases/DeleteScheduleUseCase';
import { ExportScheduleToPDFUseCase } from '../../../domains/schedule/usecases/ExportScheduleToPDFUseCase';
import { PDFProvider } from '../../providers/pdf/PDFProvider';

const scheduleRoutes = Router();

// Dependency Injection Manual (Inversão de Dependência - SOLID)
// Em projetos maiores, usar container de DI como TSyringe ou InversifyJS
const scheduleRepository = new PrismaScheduleRepository();
const scheduleItemRepository = new PrismaScheduleItemRepository();
const lessonRepository = new PrismaLessonRepository();
const pdfProvider = new PDFProvider();

const createScheduleUseCase = new CreateScheduleUseCase(
  scheduleRepository,
  scheduleItemRepository,
  lessonRepository
);

const getScheduleByIdUseCase = new GetScheduleByIdUseCase(
  scheduleRepository,
  scheduleItemRepository
);

const listSchedulesUseCase = new ListSchedulesUseCase(scheduleRepository);

const deleteScheduleUseCase = new DeleteScheduleUseCase(
  scheduleRepository,
  scheduleItemRepository
);

const exportScheduleToPDFUseCase = new ExportScheduleToPDFUseCase(
  scheduleRepository,
  scheduleItemRepository,
  pdfProvider
);

const scheduleController = new ScheduleController(
  createScheduleUseCase,
  getScheduleByIdUseCase,
  listSchedulesUseCase,
  deleteScheduleUseCase,
  exportScheduleToPDFUseCase
);

// Rotas
scheduleRoutes.post('/', (req, res, next) => scheduleController.create(req, res, next));
scheduleRoutes.get('/', (req, res, next) => scheduleController.list(req, res, next));
scheduleRoutes.get('/:id', (req, res, next) => scheduleController.getById(req, res, next));
scheduleRoutes.delete('/:id', (req, res, next) => scheduleController.delete(req, res, next));
scheduleRoutes.get('/:id/export/pdf', (req, res, next) =>
  scheduleController.exportToPDF(req, res, next)
);

export default scheduleRoutes;
