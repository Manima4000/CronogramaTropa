import { MemberkitProvider } from '../../infra/providers/memberkit/MemberkitProvider';
import { PrismaCourseRepository } from '../../infra/database/prisma/repositories/PrismaCourseRepository';
import { PrismaSectionRepository } from '../../infra/database/prisma/repositories/PrismaSectionRepository';
import { PrismaLessonRepository } from '../../infra/database/prisma/repositories/PrismaLessonRepository';
import { SyncSectionsAndLessonsUseCase } from '../../domains/sync/usecases/SyncSectionsAndLessonsUseCase';


async function syncSectionsAndLessons() {
  console.log('=== Iniciando sincronização de SECTIONS e LESSONS ===\n');

  try {
    const memberkitProvider = new MemberkitProvider();
    const courseRepository = new PrismaCourseRepository();
    const sectionRepository = new PrismaSectionRepository();
    const lessonRepository = new PrismaLessonRepository();

    const useCase = new SyncSectionsAndLessonsUseCase(
      memberkitProvider,
      courseRepository,
      sectionRepository,
      lessonRepository
    );

    const result = await useCase.execute();

    console.log(`\n✅ ${result.message}`);
    console.log(`   - Sections: ${result.stats.sectionsProcessed}`);
    console.log(`   - Lessons: ${result.stats.lessonsProcessed}`);
  } catch (error) {
    console.error('\n❌ Erro durante a sincronização:', error);
    process.exit(1);
  } 
}

syncSectionsAndLessons();
