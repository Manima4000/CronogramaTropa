import { Request, Response, NextFunction } from 'express';
import { GetLessonsBySectionIdUseCase } from '../../../domains/lesson/usecases/GetLessonsBySectionIdUseCase';
import { GetLessonsByCourseIdUseCase } from '../../../domains/lesson/usecases/GetLessonsByCourseIdUseCase';
import { GetLessonsWithVideosBySectionIdUseCase } from '../../../domains/lesson/usecases/GetLessonsWithVideosBySectionIdUseCase';
import { GetLessonsWithVideosByCourseIdUseCase } from '../../../domains/lesson/usecases/GetLessonsWithVideosByCourseIdUseCase';

// Dependency Inversion Principle (D do SOLID)
export class LessonController {
  constructor(
    private getLessonsBySectionUseCase: GetLessonsBySectionIdUseCase,
    private getLessonsByCourseUseCase: GetLessonsByCourseIdUseCase,
    private getLessonsWithVideosBySectionUseCase: GetLessonsWithVideosBySectionIdUseCase,
    private getLessonsWithVideosByCourseUseCase: GetLessonsWithVideosByCourseIdUseCase
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

  async listBySectionWithVideos(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { sectionId } = req.params;

      const lessons = await this.getLessonsWithVideosBySectionUseCase.execute(Number(sectionId));

      // Converter duração de segundos para minutos
      const lessonsWithDurationInMinutes = lessons.map(lesson => ({
        ...lesson,
        video: lesson.video ? {
          ...lesson.video,
          duration: lesson.video.duration ? Math.round(lesson.video.duration / 60) : null
        } : null
      }));

      return res.json(lessonsWithDurationInMinutes);
    } catch (error) {
      next(error);
    }
  }

  async listByCourseWithVideos(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { courseId } = req.params;

      const lessons = await this.getLessonsWithVideosByCourseUseCase.execute(Number(courseId));

      // Converter duração de segundos para minutos
      const lessonsWithDurationInMinutes = lessons.map(lesson => ({
        ...lesson,
        video: lesson.video ? {
          ...lesson.video,
          duration: lesson.video.duration ? Math.round(lesson.video.duration / 60) : null
        } : null
      }));

      return res.json(lessonsWithDurationInMinutes);
    } catch (error) {
      next(error);
    }
  }
}
