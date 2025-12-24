import { MemberkitProvider } from '../../infra/providers/memberkit/MemberkitProvider';
import { PrismaClassroomRepository } from '../../infra/database/prisma/repositories/PrismaClassroomRepository';
import { SyncClassroomsUseCase } from '../../domains/sync/usecases/SyncClassroomsUseCase';

async function syncClassrooms() {
  console.log('=== Iniciando sincronização de CLASSROOMS ===\n');

  try {
    const memberkitProvider = new MemberkitProvider();
    const classroomRepository = new PrismaClassroomRepository();

    const useCase = new SyncClassroomsUseCase(
      memberkitProvider,
      classroomRepository
    );

    const result = await useCase.execute();

    console.log(`\n✅ ${result.message}`);
    console.log(`   - Classrooms: ${result.stats.classroomsProcessed}`);
  } catch (error) {
    console.error('\n❌ Erro durante a sincronização:', error);
    process.exit(1);
  } 
}

syncClassrooms();
