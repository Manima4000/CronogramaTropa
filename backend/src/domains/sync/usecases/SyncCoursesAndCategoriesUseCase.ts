import { IMemberkitProvider } from '../../../shared/interfaces/IMemberkitProvider';
import { ICategoryRepository } from '../../category/repositories/ICategoryRepository';
import { ICourseRepository } from '../../course/repositories/ICourseRepository';
import { CategoryMapper } from '../../../infra/providers/memberkit/dtos/MemberkitCategoryDTO';
import { CourseMapper } from '../../../infra/providers/memberkit/dtos/MemberkitCourseDTO';

export interface SyncCoursesAndCategoriesUseCaseResponse {
  success: boolean;
  message: string;
  stats: {
    categoriesProcessed: number;
    coursesProcessed: number;
  };
}

export class SyncCoursesAndCategoriesUseCase {
  constructor(
    private memberkitProvider: IMemberkitProvider,
    private categoryRepository: ICategoryRepository,
    private courseRepository: ICourseRepository
  ) {}

  async execute(): Promise<SyncCoursesAndCategoriesUseCaseResponse> {
    const stats = {
      categoriesProcessed: 0,
      coursesProcessed: 0,
    };

    try {
      console.log('Sincronizando cursos e categorias...');
      const memberkitCourses = await this.memberkitProvider.getCourses();

      // 1. Extrair e salvar categorias únicas
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

      // 2. Salvar cursos
      const courses = memberkitCourses.map(CourseMapper.toDomain);
      await this.courseRepository.createMany(courses);
      stats.coursesProcessed = courses.length;
      console.log(`${courses.length} cursos sincronizados`);

      return {
        success: true,
        message: 'Courses e Categories sincronizados com sucesso',
        stats,
      };
    } catch (error) {
      console.error('Erro durante a sincronização de courses e categories:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido durante a sincronização',
        stats,
      };
    }
  }
}
