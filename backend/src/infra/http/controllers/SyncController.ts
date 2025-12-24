import { Request, Response, NextFunction } from 'express';
import { SyncCoursesAndCategoriesUseCase } from '../../../domains/sync/usecases/SyncCoursesAndCategoriesUseCase';
import { SyncSectionsAndLessonsUseCase } from '../../../domains/sync/usecases/SyncSectionsAndLessonsUseCase';
import { SyncVideosUseCase } from '../../../domains/sync/usecases/SyncVideosUseCase';
import { SyncClassroomsUseCase } from '../../../domains/sync/usecases/SyncClassroomsUseCase';

export class SyncController {
  constructor(
    private syncCoursesAndCategoriesUseCase: SyncCoursesAndCategoriesUseCase,
    private syncSectionsAndLessonsUseCase: SyncSectionsAndLessonsUseCase,
    private syncVideosUseCase: SyncVideosUseCase,
    private syncClassroomsUseCase: SyncClassroomsUseCase
  ) {}

  async syncCoursesAndCategories(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const result = await this.syncCoursesAndCategoriesUseCase.execute();
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async syncSectionsAndLessons(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const result = await this.syncSectionsAndLessonsUseCase.execute();
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async syncVideos(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const result = await this.syncVideosUseCase.execute();
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async syncClassrooms(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const result = await this.syncClassroomsUseCase.execute();
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
