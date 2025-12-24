import { MemberkitProvider } from '../../infra/providers/memberkit/MemberkitProvider';
import { PrismaCategoryRepository } from '../../infra/database/prisma/repositories/PrismaCategoryRepository';
import { PrismaCourseRepository } from '../../infra/database/prisma/repositories/PrismaCourseRepository';
import { SyncCoursesAndCategoriesUseCase } from '../../domains/sync/usecases/SyncCoursesAndCategoriesUseCase';

async function syncCoursesAndCategories() {
  console.log('=== Iniciando sincronização de COURSES e CATEGORIES ===\n');

  try {
    const memberkitProvider = new MemberkitProvider();
    const categoryRepository = new PrismaCategoryRepository();
    const courseRepository = new PrismaCourseRepository();

    const useCase = new SyncCoursesAndCategoriesUseCase(
      memberkitProvider,
      categoryRepository,
      courseRepository
    );

    const result = await useCase.execute();

    console.log(`\n✅ ${result.message}`);
    console.log(`   - Categories: ${result.stats.categoriesProcessed}`);
    console.log(`   - Courses: ${result.stats.coursesProcessed}`);
  } catch (error) {
    console.error('\n❌ Erro durante a sincronização:', error);
    process.exit(1);
  }
}

syncCoursesAndCategories();
