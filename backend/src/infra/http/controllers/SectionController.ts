import { Request, Response, NextFunction } from 'express';
import { GetSectionsByCourseIdUseCase } from '../../../domains/section/usecases/GetSectionsByCourseIdUseCase';

// Dependency Inversion Principle (D do SOLID)
export class SectionController {
  constructor(private getSectionsByCourseUseCase: GetSectionsByCourseIdUseCase) {}
  async listByCourse(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { courseId } = req.params;

      const sections = await this.getSectionsByCourseUseCase.execute(Number(courseId));

      return res.json(sections);
    } catch (error) {
      next(error);
    }
  }
}
