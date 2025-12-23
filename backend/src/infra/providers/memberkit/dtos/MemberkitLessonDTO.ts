// DTO para mapear a resposta da API Memberkit para Lesson
export interface MemberkitLessonDTO {
  id: number;
  title: string;
  slug: string;
  position: number;
  video?: MemberkitVideoDTO;
  // Outros campos que a API retorna mas não vamos armazenar
  [key: string]: any;
}

export interface MemberkitVideoDTO {
  id: number;
  source?: string;
  uid?: string;
  duration?: number;
  image?: string;
  // Outros campos que a API retorna mas não vamos armazenar
  [key: string]: any;
}

// DTO de saída (o que salvamos no banco)
export interface LessonDTO {
  id: number;
  title: string;
  slug: string;
  position: number;
  sectionId: number;
}

export interface VideoDTO {
  id: number;
  source: string | null;
  uid: string | null;
  duration: number | null;
  image: string | null;
  lessonId: number;
}

// Mapper para converter MemberkitLessonDTO -> LessonDTO
export class LessonMapper {
  static toDomain(memberkit: MemberkitLessonDTO, sectionId: number): LessonDTO {
    return {
      id: memberkit.id,
      title: memberkit.title,
      slug: memberkit.slug,
      position: memberkit.position,
      sectionId,
    };
  }

  static videoToDomain(memberkit: MemberkitVideoDTO, lessonId: number): VideoDTO {
    return {
      id: memberkit.id,
      source: memberkit.source || null,
      uid: memberkit.uid || null,
      duration: memberkit.duration || null,
      image: memberkit.image || null,
      lessonId,
    };
  }
}
