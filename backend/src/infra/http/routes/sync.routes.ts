import { Router } from 'express';
import { SyncController } from '../controllers/SyncController';
import { SyncCoursesAndCategoriesUseCase } from '../../../domains/sync/usecases/SyncCoursesAndCategoriesUseCase';
import { SyncSectionsAndLessonsUseCase } from '../../../domains/sync/usecases/SyncSectionsAndLessonsUseCase';
import { SyncVideosUseCase } from '../../../domains/sync/usecases/SyncVideosUseCase';
import { SyncClassroomsUseCase } from '../../../domains/sync/usecases/SyncClassroomsUseCase';
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

const syncCoursesAndCategoriesUseCase = new SyncCoursesAndCategoriesUseCase(
  memberkitProvider,
  categoryRepository,
  courseRepository
);

const syncSectionsAndLessonsUseCase = new SyncSectionsAndLessonsUseCase(
  memberkitProvider,
  courseRepository,
  sectionRepository,
  lessonRepository
);

const syncVideosUseCase = new SyncVideosUseCase(
  memberkitProvider,
  lessonRepository,
  sectionRepository,
  videoRepository
);

const syncClassroomsUseCase = new SyncClassroomsUseCase(
  memberkitProvider,
  classroomRepository
);

const syncController = new SyncController(
  syncCoursesAndCategoriesUseCase,
  syncSectionsAndLessonsUseCase,
  syncVideosUseCase,
  syncClassroomsUseCase
);

// Rotas

/**
 * @swagger
 * /api/sync/courses:
 *   post:
 *     tags:
 *       - Sync
 *     summary: Sincronizar Courses e Categories
 *     description: Sincroniza courses e categories do endpoint /courses da API MemberKit (agrupa entidades que vêm do mesmo endpoint)
 *     responses:
 *       200:
 *         description: Courses e Categories sincronizados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 stats:
 *                   type: object
 *                   properties:
 *                     categoriesProcessed:
 *                       type: number
 *                     coursesProcessed:
 *                       type: number
 */
syncRoutes.post('/courses', (req, res, next) => syncController.syncCoursesAndCategories(req, res, next));

/**
 * @swagger
 * /api/sync/sections:
 *   post:
 *     tags:
 *       - Sync
 *     summary: Sincronizar Sections e Lessons
 *     description: Sincroniza sections e lessons do endpoint /courses/{id} da API MemberKit (agrupa entidades que vêm do mesmo endpoint)
 *     responses:
 *       200:
 *         description: Sections e Lessons sincronizados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 stats:
 *                   type: object
 *                   properties:
 *                     sectionsProcessed:
 *                       type: number
 *                     lessonsProcessed:
 *                       type: number
 */
syncRoutes.post('/sections', (req, res, next) => syncController.syncSectionsAndLessons(req, res, next));

/**
 * @swagger
 * /api/sync/videos:
 *   post:
 *     tags:
 *       - Sync
 *     summary: Sincronizar Videos
 *     description: Sincroniza vídeos do endpoint /courses/{courseId}/lessons/{id} da API MemberKit
 *     responses:
 *       200:
 *         description: Vídeos sincronizados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 stats:
 *                   type: object
 *                   properties:
 *                     videosProcessed:
 *                       type: number
 *                     errorsCount:
 *                       type: number
 */
syncRoutes.post('/videos', (req, res, next) => syncController.syncVideos(req, res, next));

/**
 * @swagger
 * /api/sync/classrooms:
 *   post:
 *     tags:
 *       - Sync
 *     summary: Sincronizar Classrooms
 *     description: Sincroniza classrooms do endpoint /classrooms da API MemberKit
 *     responses:
 *       200:
 *         description: Classrooms sincronizadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 stats:
 *                   type: object
 *                   properties:
 *                     classroomsProcessed:
 *                       type: number
 */
syncRoutes.post('/classrooms', (req, res, next) => syncController.syncClassrooms(req, res, next));

export default syncRoutes;
