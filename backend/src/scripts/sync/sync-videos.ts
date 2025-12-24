import { MemberkitProvider } from '../../infra/providers/memberkit/MemberkitProvider';
import { PrismaLessonRepository } from '../../infra/database/prisma/repositories/PrismaLessonRepository';
import { PrismaSectionRepository } from '../../infra/database/prisma/repositories/PrismaSectionRepository';
import { PrismaVideoRepository } from '../../infra/database/prisma/repositories/PrismaVideoRepository';
import { SyncVideosUseCase } from '../../domains/sync/usecases/SyncVideosUseCase';


async function syncVideos() {
  console.log('=== Iniciando sincronização de VIDEOS ===\n');

  try {
    const memberkitProvider = new MemberkitProvider();
    const lessonRepository = new PrismaLessonRepository();
    const sectionRepository = new PrismaSectionRepository();
    const videoRepository = new PrismaVideoRepository();

    const useCase = new SyncVideosUseCase(
      memberkitProvider,
      lessonRepository,
      sectionRepository,
      videoRepository
    );

    const result = await useCase.execute();

    console.log(`\n✅ ${result.message}`);
    console.log(`   - Vídeos sincronizados: ${result.stats.videosProcessed}`);
    console.log(`   - Erros: ${result.stats.errorsCount}`);
  } catch (error) {
    console.error('\n❌ Erro durante a sincronização:', error);
    process.exit(1);
  } 
}

syncVideos();
