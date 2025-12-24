import { IMemberkitProvider } from '../../../shared/interfaces/IMemberkitProvider';
import { IClassroomRepository } from '../../classroom/repositories/IClassroomRepository';
import { ClassroomMapper } from '../../../infra/providers/memberkit/dtos/MemberkitClassroomDTO';

export interface SyncClassroomsUseCaseResponse {
  success: boolean;
  message: string;
  stats: {
    classroomsProcessed: number;
  };
}

export class SyncClassroomsUseCase {
  constructor(
    private memberkitProvider: IMemberkitProvider,
    private classroomRepository: IClassroomRepository
  ) {}

  async execute(): Promise<SyncClassroomsUseCaseResponse> {
    const stats = {
      classroomsProcessed: 0,
    };

    try {
      console.log('Sincronizando classrooms...');
      const memberkitClassrooms = await this.memberkitProvider.getClassrooms();
      const classrooms = memberkitClassrooms.map(ClassroomMapper.toDomain);
      await this.classroomRepository.createMany(classrooms);
      stats.classroomsProcessed = classrooms.length;
      console.log(`${classrooms.length} classrooms sincronizadas`);

      return {
        success: true,
        message: 'Classrooms sincronizadas com sucesso',
        stats,
      };
    } catch (error) {
      console.error('Erro durante a sincronização de classrooms:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido durante a sincronização',
        stats,
      };
    }
  }
}
