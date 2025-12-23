// DTO para mapear a resposta da API Memberkit para Course
export interface MemberkitCourseDTO {
  id: string;
  name: string;
  position: number;
  description?: string;
  image?: string;
  url?: string;
  // Outros campos que a API retorna mas não vamos armazenar
  [key: string]: any;
}

// DTO de saída (o que salvamos no banco)
export interface CourseDTO {
  id: string;
  name: string;
  position: number;
  description?: string;
  image?: string;
  url?: string;
}

// Mapper para converter MemberkitCourseDTO -> CourseDTO
export class CourseMapper {
  static toDomain(memberkit: MemberkitCourseDTO): CourseDTO {
    return {
      id: memberkit.id,
      name: memberkit.name,
      position: memberkit.position,
      description: memberkit.description,
      image: memberkit.image,
      url: memberkit.url,
    };
  }
}
