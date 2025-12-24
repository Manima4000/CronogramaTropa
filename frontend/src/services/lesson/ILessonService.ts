import type { LessonWithVideoDTO } from '../../dtos/course/LessonDTO';

export interface ILessonService {
  listBySectionWithVideos(sectionId: number): Promise<LessonWithVideoDTO[]>;
  listByCourseWithVideos(courseId: number): Promise<LessonWithVideoDTO[]>;
}
