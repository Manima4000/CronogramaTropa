import { Request, Response, NextFunction } from 'express';
import { GetLessonsBySectionIdUseCase } from '../../../domains/lesson/usecases/GetLessonsBySectionIdUseCase';
import { GetLessonsByCourseIdUseCase } from '../../../domains/lesson/usecases/GetLessonsByCourseIdUseCase';

// Dependency Inversion Principle (D do SOLID)
export class LessonController {
  constructor(
    private getLessonsBySectionUseCase: GetLessonsBySectionIdUseCase,
    private getLessonsByCourseUseCase: GetLessonsByCourseIdUseCase
  ) {}

  async listBySection(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { sectionId } = req.params;

      const lessons = await this.getLessonsBySectionUseCase.execute(Number(sectionId));

      return res.json(lessons);
    } catch (error) {
      next(error);
    }
  }

  async listByCourse(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { courseId } = req.params;

      const lessons = await this.getLessonsByCourseUseCase.execute(Number(courseId));

      return res.json(lessons);
    } catch (error) {
      next(error);
    }
  }
}
