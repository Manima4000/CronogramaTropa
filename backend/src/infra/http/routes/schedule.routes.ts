import { Router } from 'express';
import { ScheduleController } from '../controllers/ScheduleController';
import { PrismaScheduleRepository } from '../../database/prisma/repositories/PrismaScheduleRepository';
import { PrismaScheduleItemRepository } from '../../database/prisma/repositories/PrismaScheduleItemRepository';
import { PrismaCourseRepository } from '../../database/prisma/repositories/PrismaCourseRepository';
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
const courseRepository = new PrismaCourseRepository();
const lessonRepository = new PrismaLessonRepository();
const pdfProvider = new PDFProvider();

const createScheduleUseCase = new CreateScheduleUseCase(
  scheduleRepository,
  scheduleItemRepository,
  courseRepository,
  lessonRepository
);

const getScheduleByIdUseCase = new GetScheduleByIdUseCase(
  scheduleRepository,
  scheduleItemRepository,
  lessonRepository
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

/**
 * @swagger
 * /api/schedules:
 *   post:
 *     tags:
 *       - Schedules
 *     summary: Criar um novo cronograma
 *     description: Cria um novo cronograma de estudos para um curso específico
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateScheduleRequest'
 *     responses:
 *       201:
 *         description: Cronograma criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 schedule:
 *                   $ref: '#/components/schemas/Schedule'
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ScheduleItem'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Curso não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
scheduleRoutes.post('/', (req, res, next) => scheduleController.create(req, res, next));

/**
 * @swagger
 * /api/schedules:
 *   get:
 *     tags:
 *       - Schedules
 *     summary: Listar todos os cronogramas
 *     description: Retorna uma lista de todos os cronogramas cadastrados
 *     responses:
 *       200:
 *         description: Lista de cronogramas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schedule'
 */
scheduleRoutes.get('/', (req, res, next) => scheduleController.list(req, res, next));

/**
 * @swagger
 * /api/schedules/{id}:
 *   get:
 *     tags:
 *       - Schedules
 *     summary: Buscar cronograma por ID
 *     description: Retorna um cronograma específico com seus itens
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do cronograma
 *     responses:
 *       200:
 *         description: Cronograma encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 schedule:
 *                   $ref: '#/components/schemas/Schedule'
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ScheduleItem'
 *       404:
 *         description: Cronograma não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
scheduleRoutes.get('/:id', (req, res, next) => scheduleController.getById(req, res, next));

/**
 * @swagger
 * /api/schedules/{id}:
 *   delete:
 *     tags:
 *       - Schedules
 *     summary: Deletar cronograma
 *     description: Remove um cronograma e todos os seus itens
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do cronograma
 *     responses:
 *       204:
 *         description: Cronograma deletado com sucesso
 *       404:
 *         description: Cronograma não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
scheduleRoutes.delete('/:id', (req, res, next) => scheduleController.delete(req, res, next));

/**
 * @swagger
 * /api/schedules/{id}/export/pdf:
 *   get:
 *     tags:
 *       - Schedules
 *     summary: Exportar cronograma para PDF
 *     description: Gera e retorna um arquivo PDF do cronograma
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do cronograma
 *     responses:
 *       200:
 *         description: PDF gerado com sucesso
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Cronograma não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
scheduleRoutes.get('/:id/export/pdf', (req, res, next) =>
  scheduleController.exportToPDF(req, res, next)
);

export default scheduleRoutes;
