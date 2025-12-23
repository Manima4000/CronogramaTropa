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

// DTO de saída (o que salvamos no banco)
export interface CourseDTO {
  id: number;
  name: string;
  position: number;
  description: string | null;
  imageUrl: string | null;
  categoryId: number;
}

// Mapper para converter MemberkitCourseDTO -> CourseDTO
export class CourseMapper {
  static toDomain(memberkit: MemberkitCourseDTO): CourseDTO {
    return {
      id: memberkit.id,
      name: memberkit.name,
      position: memberkit.position,
      description: memberkit.description || null,
      imageUrl: memberkit.image_url || null,
      categoryId: memberkit.category?.id || 0,
    };
  }
}
