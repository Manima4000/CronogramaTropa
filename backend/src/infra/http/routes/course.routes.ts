import { Router } from 'express';
import { CourseController } from '../controllers/CourseController';
import { PrismaCourseRepository } from '../../database/prisma/repositories/PrismaCourseRepository';
import { ListAllCoursesUseCase } from '../../../domains/course/usecases/ListAllCoursesUseCase';
import { GetCourseByIdUseCase } from '../../../domains/course/usecases/GetCourseByIdUseCase';
import { authenticate } from '../middlewares/authenticate';

const courseRoutes = Router();

// Aplicar autenticação a todas as rotas de cursos
courseRoutes.use(authenticate);

// Dependency Injection Manual
const courseRepository = new PrismaCourseRepository();

const listAllCoursesUseCase = new ListAllCoursesUseCase(courseRepository);
const getCourseByIdUseCase = new GetCourseByIdUseCase(courseRepository);

const courseController = new CourseController(listAllCoursesUseCase, getCourseByIdUseCase);

// Rotas

/**
 * @swagger
 * /api/courses:
 *   get:
 *     tags:
 *       - Courses
 *     summary: Listar todos os cursos
 *     description: Retorna uma lista de todos os cursos cadastrados ordenados por posição
 *     responses:
 *       200:
 *         description: Lista de cursos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */
courseRoutes.get('/', (req, res, next) => courseController.list(req, res, next));

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     tags:
 *       - Courses
 *     summary: Buscar curso por ID
 *     description: Retorna um curso específico
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do curso
 *     responses:
 *       200:
 *         description: Curso encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Curso não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
courseRoutes.get('/:id', (req, res, next) => courseController.getById(req, res, next));

export default courseRoutes;
