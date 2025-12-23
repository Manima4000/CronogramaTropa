import { IVideoRepository, Video } from '../../../../domains/video/repositories/IVideoRepository';
import { prisma } from '../prisma';

export class PrismaVideoRepository implements IVideoRepository {
  async create(video: Video): Promise<Video> {
    return await prisma.video.create({
      data: video,
    });
  }

  async createMany(videos: Video[]): Promise<void> {
    await prisma.video.createMany({
      data: videos,
      skipDuplicates: true,
    });
  }

  async findAll(): Promise<Video[]> {
    return await prisma.video.findMany();
  }

  async findById(id: number): Promise<Video | null> {
    return await prisma.video.findUnique({
      where: { id },
    });
  }

  async findByLessonId(lessonId: number): Promise<Video | null> {
    return await prisma.video.findUnique({
      where: { lessonId },
    });
  }

  async update(id: number, data: Partial<Video>): Promise<Video> {
    return await prisma.video.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.video.delete({
      where: { id },
    });
  }
}
