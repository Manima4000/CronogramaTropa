import { IMemberkitProvider } from '../../../shared/interfaces/IMemberkitProvider';
import { ICategoryRepository } from '../../category/repositories/ICategoryRepository';
import { ICourseRepository } from '../../course/repositories/ICourseRepository';
import { ISectionRepository } from '../../section/repositories/ISectionRepository';
import { ILessonRepository } from '../../lesson/repositories/ILessonRepository';
import { IVideoRepository } from '../../video/repositories/IVideoRepository';
import { IClassroomRepository } from '../../classroom/repositories/IClassroomRepository';
import { CategoryMapper } from '../../../infra/providers/memberkit/dtos/MemberkitCategoryDTO';
import { CourseMapper } from '../../../infra/providers/memberkit/dtos/MemberkitCourseDTO';
import { SectionMapper } from '../../../infra/providers/memberkit/dtos/MemberkitSectionDTO';
import { LessonMapper } from '../../../infra/providers/memberkit/dtos/MemberkitLessonDTO';
import { ClassroomMapper } from '../../../infra/providers/memberkit/dtos/MemberkitClassroomDTO';

export interface SyncMemberkitDataUseCaseRequest {
  syncCategories?: boolean;
  syncCourses?: boolean;
  syncSections?: boolean;
  syncLessons?: boolean;
  syncVideos?: boolean;
  syncClassrooms?: boolean;
}

export interface SyncMemberkitDataUseCaseResponse {
  success: boolean;
  message: string;
  stats: {
    categoriesProcessed: number;
    coursesProcessed: number;
    sectionsProcessed: number;
    lessonsProcessed: number;
    videosProcessed: number;
    classroomsProcessed: number;
  };
}

export class SyncMemberkitDataUseCase {
  constructor(
    private memberkitProvider: IMemberkitProvider,
    private categoryRepository: ICategoryRepository,
    private courseRepository: ICourseRepository,
    private sectionRepository: ISectionRepository,
    private lessonRepository: ILessonRepository,
    private videoRepository: IVideoRepository,
    private classroomRepository: IClassroomRepository
  ) {}

  async execute(
    request?: SyncMemberkitDataUseCaseRequest
  ): Promise<SyncMemberkitDataUseCaseResponse> {
    const stats = {
      categoriesProcessed: 0,
      coursesProcessed: 0,
      sectionsProcessed: 0,
      lessonsProcessed: 0,
      videosProcessed: 0,
      classroomsProcessed: 0,
    };

    try {
      // Por padrão, sincroniza tudo se não for especificado
      const syncAll = !request || Object.keys(request).length === 0;
      const shouldSync = {
        categories: syncAll || request?.syncCategories,
        courses: syncAll || request?.syncCourses,
        sections: syncAll || request?.syncSections,
        lessons: syncAll || request?.syncLessons,
        videos: syncAll || request?.syncVideos,
        classrooms: syncAll || request?.syncClassrooms,
      };

      // 1. Sincronizar Cursos (lista básica) e extrair Categorias
      if (shouldSync.courses || shouldSync.categories) {
        console.log('Sincronizando cursos e categorias...');
        const memberkitCourses = await this.memberkitProvider.getCourses();

        // Extrair categorias únicas dos cursos
        if (shouldSync.categories) {
          const categoriesMap = new Map<number, any>();
          memberkitCourses.forEach(course => {
            if (course.category) {
              categoriesMap.set(course.category.id, {
                id: course.category.id,
                name: course.category.name || '',
              });
            }
          });
          const categories = Array.from(categoriesMap.values()).map(CategoryMapper.toDomain);
          await this.categoryRepository.createMany(categories);
          stats.categoriesProcessed = categories.length;
          console.log(`${categories.length} categorias sincronizadas`);
        }

        // Salvar cursos
        if (shouldSync.courses) {
          const courses = memberkitCourses.map(CourseMapper.toDomain);
          await this.courseRepository.createMany(courses);
          stats.coursesProcessed = courses.length;
          console.log(`${courses.length} cursos sincronizados`);
        }
      }

      // 2. Sincronizar Sections e Lessons (vêm juntos no /courses/{id})
      if (shouldSync.sections || shouldSync.lessons) {
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

            // Processar sections
            if (shouldSync.sections && courseDetails.sections) {
              const sections = courseDetails.sections.map((section: any) =>
                SectionMapper.toDomain(section, course.id)
              );
              await this.sectionRepository.createMany(sections);
              stats.sectionsProcessed += sections.length;

              // Processar lessons de cada section
              if (shouldSync.lessons) {
                for (const section of courseDetails.sections) {
                  if (section.lessons && Array.isArray(section.lessons)) {
                    for (const lessonData of section.lessons) {
                      const lesson = LessonMapper.toDomain(lessonData, section.id);
                      await this.lessonRepository.create(lesson);
                      stats.lessonsProcessed++;
                    }
                  }
                }
              }

              console.log(`  → ${sections.length} sections e ${courseDetails.sections.reduce((acc: number, s: any) => acc + (s.lessons?.length || 0), 0)} lessons do curso ${course.name}`);
            }
          } catch (error) {
            console.error(`Erro ao processar curso ${course.id}:`, error instanceof Error ? error.message : error);
          }
        }
        console.log(`Total: ${stats.sectionsProcessed} sections e ${stats.lessonsProcessed} lessons sincronizadas`);
      }

      // 3. Sincronizar Vídeos (buscar detalhes de cada lesson)
      if (shouldSync.videos) {
        console.log('Sincronizando vídeos...');
        const lessons = await this.lessonRepository.findAll();
        console.log(`Total de ${lessons.length} lessons para processar vídeos`);

        let processedCount = 0;
        let errorCount = 0;

        for (const lesson of lessons) {
          // Encontrar o curso da lesson para usar no endpoint
          const section = await this.sectionRepository.findById(lesson.sectionId);
          if (!section) {
            console.warn(`Section ${lesson.sectionId} não encontrada para lesson ${lesson.id}`);
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
            errorCount++;
            console.error(`Erro ao buscar vídeo da lesson ${lesson.id}:`, error instanceof Error ? error.message : error);
            // Continua com as próximas lessons
          }
        }

        console.log(`Sincronização de vídeos concluída: ${stats.videosProcessed} vídeos sincronizados, ${errorCount} erros`);
      }

      // 4. Sincronizar Classrooms
      if (shouldSync.classrooms) {
        console.log('Sincronizando classrooms...');
        const memberkitClassrooms = await this.memberkitProvider.getClassrooms();
        const classrooms = memberkitClassrooms.map(ClassroomMapper.toDomain);
        await this.classroomRepository.createMany(classrooms);
        stats.classroomsProcessed = classrooms.length;
        console.log(`${classrooms.length} classrooms sincronizadas`);
      }

      return {
        success: true,
        message: 'Sincronização concluída com sucesso',
        stats,
      };
    } catch (error) {
      console.error('Erro durante a sincronização:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido durante a sincronização',
        stats,
      };
    }
  }
}
