import { Request, Response, NextFunction } from 'express';
import { ListAllCoursesUseCase } from '../../../domains/course/usecases/ListAllCoursesUseCase';
import { GetCourseByIdUseCase } from '../../../domains/course/usecases/GetCourseByIdUseCase';
import { AppError } from '../../../shared/errors/AppError';

// Dependency Inversion Principle (D do SOLID)
export class CourseController {
  constructor(
    private listAllCoursesUseCase: ListAllCoursesUseCase,
    private getCourseByIdUseCase: GetCourseByIdUseCase
  ) {}

  async list(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const courses = await this.listAllCoursesUseCase.execute();
      return res.json(courses);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.params;

      const course = await this.getCourseByIdUseCase.execute(Number(id));

      if (!course) {
        throw new AppError('Curso não encontrado', 404);
      }

      return res.json(course);
    } catch (error) {
      next(error);
    }
  }
}
