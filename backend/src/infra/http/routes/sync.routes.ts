import { Router } from 'express';
import { SyncController } from '../controllers/SyncController';
import { SyncMemberkitDataUseCase } from '../../../domains/sync/usecases/SyncMemberkitDataUseCase';
import { MemberkitProvider } from '../../providers/memberkit/MemberkitProvider';
import { PrismaCategoryRepository } from '../../database/prisma/repositories/PrismaCategoryRepository';
import { PrismaCourseRepository } from '../../database/prisma/repositories/PrismaCourseRepository';
import { PrismaSectionRepository } from '../../database/prisma/repositories/PrismaSectionRepository';
import { PrismaLessonRepository } from '../../database/prisma/repositories/PrismaLessonRepository';
import { PrismaVideoRepository } from '../../database/prisma/repositories/PrismaVideoRepository';
import { PrismaClassroomRepository } from '../../database/prisma/repositories/PrismaClassroomRepository';

const syncRoutes = Router();

// Dependency Injection Manual
const memberkitProvider = new MemberkitProvider();
const categoryRepository = new PrismaCategoryRepository();
const courseRepository = new PrismaCourseRepository();
const sectionRepository = new PrismaSectionRepository();
const lessonRepository = new PrismaLessonRepository();
const videoRepository = new PrismaVideoRepository();
const classroomRepository = new PrismaClassroomRepository();

const syncMemberkitDataUseCase = new SyncMemberkitDataUseCase(
  memberkitProvider,
  categoryRepository,
  courseRepository,
  sectionRepository,
  lessonRepository,
  videoRepository,
  classroomRepository
);

const syncController = new SyncController(syncMemberkitDataUseCase);

// Rotas

/**
 * @swagger
 * /api/sync:
 *   post:
 *     tags:
 *       - Sync
 *     summary: Sincronizar todos os dados do MemberKit
 *     description: Sincroniza todos os dados (categorias, cursos, seções, aulas, vídeos e turmas) da API do MemberKit para o banco de dados local
 *     responses:
 *       200:
 *         description: Sincronização concluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SyncResponse'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: Sincronização concluída com sucesso
 *                   stats:
 *                     categoriesProcessed: 10
 *                     coursesProcessed: 50
 *                     sectionsProcessed: 200
 *                     lessonsProcessed: 1500
 *                     videosProcessed: 1500
 *                     classroomsProcessed: 25
 *       500:
 *         description: Erro durante a sincronização
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SyncResponse'
 *             examples:
 *               error:
 *                 value:
 *                   success: false
 *                   message: Memberkit API error - Unauthorized
 *                   stats:
 *                     categoriesProcessed: 0
 *                     coursesProcessed: 0
 *                     sectionsProcessed: 0
 *                     lessonsProcessed: 0
 *                     videosProcessed: 0
 *                     classroomsProcessed: 0
 */
syncRoutes.post('/', (req, res, next) => syncController.syncAll(req, res, next));

/**
 * @swagger
 * /api/sync/partial:
 *   post:
 *     tags:
 *       - Sync
 *     summary: Sincronizar dados específicos do MemberKit
 *     description: Sincroniza apenas os tipos de dados selecionados da API do MemberKit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SyncPartialRequest'
 *           examples:
 *             onlyCategoriesAndCourses:
 *               summary: Sincronizar apenas categorias e cursos
 *               value:
 *                 syncCategories: true
 *                 syncCourses: true
 *                 syncSections: false
 *                 syncLessons: false
 *                 syncVideos: false
 *                 syncClassrooms: false
 *             everything:
 *               summary: Sincronizar tudo (igual ao endpoint /sync)
 *               value:
 *                 syncCategories: true
 *                 syncCourses: true
 *                 syncSections: true
 *                 syncLessons: true
 *                 syncVideos: true
 *                 syncClassrooms: true
 *     responses:
 *       200:
 *         description: Sincronização parcial concluída
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SyncResponse'
 *       500:
 *         description: Erro durante a sincronização
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SyncResponse'
 */
syncRoutes.post('/partial', (req, res, next) => syncController.syncPartial(req, res, next));

export default syncRoutes;
