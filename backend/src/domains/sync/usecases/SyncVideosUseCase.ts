import { IMemberkitProvider } from '../../../shared/interfaces/IMemberkitProvider';
import { ILessonRepository } from '../../lesson/repositories/ILessonRepository';
import { ISectionRepository } from '../../section/repositories/ISectionRepository';
import { IVideoRepository } from '../../video/repositories/IVideoRepository';
import { LessonMapper } from '../../../infra/providers/memberkit/dtos/MemberkitLessonDTO';

export interface SyncVideosUseCaseResponse {
  success: boolean;
  message: string;
  stats: {
    videosProcessed: number;
    errorsCount: number;
  };
}

export class SyncVideosUseCase {
  constructor(
    private memberkitProvider: IMemberkitProvider,
    private lessonRepository: ILessonRepository,
    private sectionRepository: ISectionRepository,
    private videoRepository: IVideoRepository
  ) {}

  async execute(): Promise<SyncVideosUseCaseResponse> {
    const stats = {
      videosProcessed: 0,
      errorsCount: 0,
    };

    try {
      console.log('Sincronizando vídeos...');
      const lessons = await this.lessonRepository.findAll();
      console.log(`Total de ${lessons.length} lessons para processar vídeos`);

      let processedCount = 0;

      for (const lesson of lessons) {
        // Encontrar o curso da lesson para usar no endpoint
        const section = await this.sectionRepository.findById(lesson.sectionId);
        if (!section) {
          console.warn(`Section ${lesson.sectionId} não encontrada para lesson ${lesson.id}`);
          stats.errorsCount++;
          continue;
        }

        try {
          // Buscar detalhes da lesson que incluem vídeo
          const lessonDetails = await this.memberkitProvider.getLessonById(
            section.courseId,
            lesson.id
          );

          // Se a lesson tiver vídeo, sincronizar
          if (lessonDetails.video) {
            const video = LessonMapper.videoToDomain(lessonDetails.video, lesson.id);
            await this.videoRepository.create(video);
            stats.videosProcessed++;
          }

          processedCount++;

          // Log de progresso a cada 10 lessons
          if (processedCount % 10 === 0) {
            console.log(`Progresso: ${processedCount}/${lessons.length} lessons processadas (${stats.videosProcessed} vídeos encontrados)`);
          }
        } catch (error) {
          stats.errorsCount++;
          console.error(`Erro ao buscar vídeo da lesson ${lesson.id}:`, error instanceof Error ? error.message : error);
        }
      }

      console.log(`Sincronização de vídeos concluída: ${stats.videosProcessed} vídeos sincronizados, ${stats.errorsCount} erros`);

      return {
        success: true,
        message: 'Vídeos sincronizados com sucesso',
        stats,
      };
    } catch (error) {
      console.error('Erro durante a sincronização de vídeos:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido durante a sincronização',
        stats,
      };
    }
  }
}
