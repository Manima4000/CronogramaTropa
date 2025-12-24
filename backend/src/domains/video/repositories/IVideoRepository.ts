import { Video } from '../entities/Video';

export interface IVideoRepository {
  create(video: Video): Promise<Video>;
  createMany(videos: Video[]): Promise<void>;
  findAll(): Promise<Video[]>;
  findById(id: number): Promise<Video | null>;
  findByLessonId(lessonId: number): Promise<Video | null>;
  update(id: number, data: Partial<Video>): Promise<Video>;
  delete(id: number): Promise<void>;
}
