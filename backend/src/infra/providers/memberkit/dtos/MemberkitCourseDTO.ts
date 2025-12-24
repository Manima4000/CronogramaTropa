import { Course } from '../../../../domains/course/entities/Course';

// DTO para mapear a resposta da API Memberkit para Course
export interface MemberkitCourseDTO {
  id: number;
  name: string;
  position: number;
  description?: string;
  image_url?: string;
  category?: {
    id: number;
    name?: string;
  };
  // Outros campos que a API retorna mas não vamos armazenar
  [key: string]: any;
}

// Mapper para converter MemberkitCourseDTO -> Course (Domain Entity)
export class CourseMapper {
  static toDomain(memberkit: MemberkitCourseDTO): Course {
    return new Course(
      memberkit.id,
      memberkit.name,
      memberkit.position,
      memberkit.description || null,
      memberkit.image_url || null,
      memberkit.category?.id || 0
    );
  }
}
