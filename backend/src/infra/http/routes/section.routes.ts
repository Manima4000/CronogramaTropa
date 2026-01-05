import { Router } from 'express';
import { SectionController } from '../controllers/SectionController';
import { PrismaSectionRepository } from '../../database/prisma/repositories/PrismaSectionRepository';
import { GetSectionsByCourseIdUseCase } from '../../../domains/section/usecases/GetSectionsByCourseIdUseCase';
import { authenticate } from '../middlewares/authenticate';

const sectionRoutes = Router();

// Aplicar autenticação a todas as rotas de sections
sectionRoutes.use(authenticate);

// Dependency Injection Manual
const sectionRepository = new PrismaSectionRepository();

const getSectionsByCourseIdUseCase = new GetSectionsByCourseIdUseCase(sectionRepository);

const sectionController = new SectionController(getSectionsByCourseIdUseCase);

// Rotas

/**
 * @swagger
 * /api/sections/course/{courseId}:
 *   get:
 *     tags:
 *       - Sections
 *     summary: Listar seções por curso
 *     description: Retorna todas as seções de um curso específico ordenadas por posição
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do curso
 *     responses:
 *       200:
 *         description: Lista de seções
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Section'
 */
sectionRoutes.get('/course/:courseId', (req, res, next) =>
  sectionController.listByCourse(req, res, next)
);

export default sectionRoutes;
