import { IVideoRepository } from '../../../../domains/video/repositories/IVideoRepository';
import { Video } from '../../../../domains/video/entities/Video';
import { prisma } from '../prisma';

export class PrismaVideoRepository implements IVideoRepository {
  async create(video: Video): Promise<Video> {
    const created = await prisma.video.upsert({
      where: {
        id_lessonId: {
          id: video.id,
          lessonId: video.lessonId,
        },
      },
      update: {
        source: video.source,
        uid: video.uid,
        duration: video.duration,
        image: video.image,
      },
      create: {
        id: video.id,
        source: video.source,
        uid: video.uid,
        duration: video.duration,
        image: video.image,
        lessonId: video.lessonId,
      },
    });
    return new Video(
      created.id,
      created.source,
      created.uid,
      created.duration,
      created.image,
      created.lessonId
    );
  }

  async createMany(videos: Video[]): Promise<void> {
    await prisma.video.createMany({
      data: videos.map(v => ({
        id: v.id,
        source: v.source,
        uid: v.uid,
        duration: v.duration,
        image: v.image,
        lessonId: v.lessonId,
      })),
      skipDuplicates: true,
    });
  }

  async findAll(): Promise<Video[]> {
    const videos = await prisma.video.findMany();
    return videos.map(v => new Video(
      v.id,
      v.source,
      v.uid,
      v.duration,
      v.image,
      v.lessonId
    ));
  }

  async findById(id: number, lessonId: number): Promise<Video | null> {
    const video = await prisma.video.findUnique({
      where: {
        id_lessonId: {
          id,
          lessonId,
        },
      },
    });
    return video ? new Video(
      video.id,
      video.source,
      video.uid,
      video.duration,
      video.image,
      video.lessonId
    ) : null;
  }

  async findByLessonId(lessonId: number): Promise<Video | null> {
    const video = await prisma.video.findUnique({
      where: { lessonId },
    });
    return video ? new Video(
      video.id,
      video.source,
      video.uid,
      video.duration,
      video.image,
      video.lessonId
    ) : null;
  }

  async update(id: number, lessonId: number, data: Partial<Video>): Promise<Video> {
    const updated = await prisma.video.update({
      where: {
        id_lessonId: {
          id,
          lessonId,
        },
      },
      data: {
        source: data.source,
        uid: data.uid,
        duration: data.duration,
        image: data.image,
      },
    });
    return new Video(
      updated.id,
      updated.source,
      updated.uid,
      updated.duration,
      updated.image,
      updated.lessonId
    );
  }

  async delete(id: number, lessonId: number): Promise<void> {
    await prisma.video.delete({
      where: {
        id_lessonId: {
          id,
          lessonId,
        },
      },
    });
  }
}
