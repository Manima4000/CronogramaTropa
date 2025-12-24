import { IMemberkitProvider } from '../../../shared/interfaces/IMemberkitProvider';
import { ICourseRepository } from '../../course/repositories/ICourseRepository';
import { ISectionRepository } from '../../section/repositories/ISectionRepository';
import { ILessonRepository } from '../../lesson/repositories/ILessonRepository';
import { SectionMapper } from '../../../infra/providers/memberkit/dtos/MemberkitSectionDTO';
import { LessonMapper } from '../../../infra/providers/memberkit/dtos/MemberkitLessonDTO';

export interface SyncSectionsAndLessonsUseCaseResponse {
  success: boolean;
  message: string;
  stats: {
    sectionsProcessed: number;
    lessonsProcessed: number;
  };
}

export class SyncSectionsAndLessonsUseCase {
  constructor(
    private memberkitProvider: IMemberkitProvider,
    private courseRepository: ICourseRepository,
    private sectionRepository: ISectionRepository,
    private lessonRepository: ILessonRepository
  ) {}

  async execute(): Promise<SyncSectionsAndLessonsUseCaseResponse> {
    const stats = {
      sectionsProcessed: 0,
      lessonsProcessed: 0,
    };

    try {
      console.log('Sincronizando sections e lessons...');
      const courses = await this.courseRepository.findAll();
      console.log(`Total de ${courses.length} cursos para processar`);

      let courseCount = 0;
      for (const course of courses) {
        courseCount++;
        console.log(`Processando curso ${courseCount}/${courses.length}: ${course.name} (ID: ${course.id})`);

        try {
          // Buscar detalhes do curso (que inclui sections e lessons)
          const courseDetails = await this.memberkitProvider.getCourseById(course.id);

          if (!courseDetails.sections || !Array.isArray(courseDetails.sections)) {
            console.log(`  Nenhuma section encontrada`);
            continue;
          }

          // 1. Processar sections
          const sections = courseDetails.sections.map((section: any) =>
            SectionMapper.toDomain(section, course.id)
          );
          await this.sectionRepository.createMany(sections);
          stats.sectionsProcessed += sections.length;

          // 2. Processar lessons de cada section
          for (const section of courseDetails.sections) {
            if (section.lessons && Array.isArray(section.lessons)) {
              for (const lessonData of section.lessons) {
                const lesson = LessonMapper.toDomain(lessonData, section.id);
                await this.lessonRepository.create(lesson);
                stats.lessonsProcessed++;
              }
            }
          }

          console.log(`  → ${sections.length} sections e ${courseDetails.sections.reduce((acc: number, s: any) => acc + (s.lessons?.length || 0), 0)} lessons do curso ${course.name}`);
        } catch (error) {
          console.error(`Erro ao processar curso ${course.id}:`, error instanceof Error ? error.message : error);
        }
      }

      console.log(`Total: ${stats.sectionsProcessed} sections e ${stats.lessonsProcessed} lessons sincronizadas`);

      return {
        success: true,
        message: 'Sections e Lessons sincronizados com sucesso',
        stats,
      };
    } catch (error) {
      console.error('Erro durante a sincronização de sections e lessons:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido durante a sincronização',
        stats,
      };
    }
  }
}
