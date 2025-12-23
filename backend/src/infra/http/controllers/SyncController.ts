import { Request, Response, NextFunction } from 'express';
import { SyncMemberkitDataUseCase } from '../../../domains/sync/usecases/SyncMemberkitDataUseCase';

export class SyncController {
  constructor(private syncMemberkitDataUseCase: SyncMemberkitDataUseCase) {}

  async syncAll(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const result = await this.syncMemberkitDataUseCase.execute();
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async syncPartial(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const {
        syncCategories,
        syncCourses,
        syncSections,
        syncLessons,
        syncVideos,
        syncClassrooms,
      } = req.body;

      const result = await this.syncMemberkitDataUseCase.execute({
        syncCategories,
        syncCourses,
        syncSections,
        syncLessons,
        syncVideos,
        syncClassrooms,
      });

      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
