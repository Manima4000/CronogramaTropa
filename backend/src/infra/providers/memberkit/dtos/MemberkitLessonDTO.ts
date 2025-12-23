// DTO para mapear a resposta da API Memberkit para Lesson
export interface MemberkitLessonDTO {
  id: string;
  name: string;
  slug: string;
  position: number;
  video?: MemberkitVideoDTO;
  // Outros campos que a API retorna mas não vamos armazenar
  [key: string]: any;
}

export interface MemberkitVideoDTO {
  id: string;
  source?: string;
  uid?: string;
  duration?: number;
  image?: string;
  // Outros campos que a API retorna mas não vamos armazenar
  [key: string]: any;
}

// DTO de saída (o que salvamos no banco)
export interface LessonDTO {
  id: string;
  name: string;
  slug: string;
  position: number;
  sectionId: string;
}

export interface VideoDTO {
  id: string;
  source?: string;
  uid?: string;
  duration?: number;
  image?: string;
  lessonId: string;
}

// Mapper para converter MemberkitLessonDTO -> LessonDTO
export class LessonMapper {
  static toDomain(memberkit: MemberkitLessonDTO, sectionId: string): LessonDTO {
    return {
      id: memberkit.id,
      name: memberkit.name,
      slug: memberkit.slug,
      position: memberkit.position,
      sectionId,
    };
  }

  static videoToDomain(memberkit: MemberkitVideoDTO, lessonId: string): VideoDTO {
    return {
      id: memberkit.id,
      source: memberkit.source,
      uid: memberkit.uid,
      duration: memberkit.duration,
      image: memberkit.image,
      lessonId,
    };
  }
}
