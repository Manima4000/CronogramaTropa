import type { AxiosInstance } from 'axios';
import type { ILessonService } from './ILessonService';
import type { LessonWithVideoDTO } from '../../dtos/course/LessonDTO';

export class LessonService implements ILessonService {
  private httpClient: AxiosInstance;

  constructor(httpClient: AxiosInstance) {
    this.httpClient = httpClient;
  }

  async listBySectionWithVideos(sectionId: number): Promise<LessonWithVideoDTO[]> {
    const response = await this.httpClient.get<LessonWithVideoDTO[]>(
      `/api/lessons/section/${sectionId}/with-videos`
    );
    return response.data;
  }

  async listByCourseWithVideos(courseId: number): Promise<LessonWithVideoDTO[]> {
    const response = await this.httpClient.get<LessonWithVideoDTO[]>(
      `/api/lessons/course/${courseId}/with-videos`
    );
    return response.data;
  }
}
