import { IVideoRepository } from '../repositories/IVideoRepository';
import { Video } from '../entities/Video';

export class GetVideoByLessonIdUseCase {
  constructor(private videoRepository: IVideoRepository) {}

  async execute(lessonId: number): Promise<Video | null> {
    return await this.videoRepository.findByLessonId(lessonId);
  }
}
