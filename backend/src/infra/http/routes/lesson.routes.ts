import { Router } from 'express';
import { LessonController } from '../controllers/LessonController';
import { PrismaLessonRepository } from '../../database/prisma/repositories/PrismaLessonRepository';
import { PrismaSectionRepository } from '../../database/prisma/repositories/PrismaSectionRepository';
import { GetLessonsBySectionIdUseCase } from '../../../domains/lesson/usecases/GetLessonsBySectionIdUseCase';
import { GetLessonsByCourseIdUseCase } from '../../../domains/lesson/usecases/GetLessonsByCourseIdUseCase';

const lessonRoutes = Router();

// Dependency Injection Manual
const lessonRepository = new PrismaLessonRepository();
const sectionRepository = new PrismaSectionRepository();

const getLessonsBySectionIdUseCase = new GetLessonsBySectionIdUseCase(lessonRepository);
const getLessonsByCourseIdUseCase = new GetLessonsByCourseIdUseCase(
  lessonRepository,
  sectionRepository
);

const lessonController = new LessonController(
  getLessonsBySectionIdUseCase,
  getLessonsByCourseIdUseCase
);

// Rotas

/**
 * @swagger
 * /api/lessons/section/{sectionId}:
 *   get:
 *     tags:
 *       - Lessons
 *     summary: Listar aulas por seção
 *     description: Retorna todas as aulas de uma seção específica ordenadas por posição
 *     parameters:
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da seção
 *     responses:
 *       200:
 *         description: Lista de aulas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 */
lessonRoutes.get('/section/:sectionId', (req, res, next) =>
  lessonController.listBySection(req, res, next)
);

/**
 * @swagger
 * /api/lessons/course/{courseId}:
 *   get:
 *     tags:
 *       - Lessons
 *     summary: Listar todas as aulas de um curso
 *     description: Retorna todas as aulas de um curso (de todas as seções) ordenadas por posição
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do curso
 *     responses:
 *       200:
 *         description: Lista de aulas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 */
lessonRoutes.get('/course/:courseId', (req, res, next) =>
  lessonController.listByCourse(req, res, next)
);

export default lessonRoutes;
