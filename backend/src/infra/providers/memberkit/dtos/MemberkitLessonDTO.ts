import { Lesson } from '../../../../domains/lesson/entities/Lesson';
import { Video } from '../../../../domains/video/entities/Video';

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

// Mapper para converter MemberkitLessonDTO -> Lesson (Domain Entity)
export class LessonMapper {
  static toDomain(memberkit: MemberkitLessonDTO, sectionId: number): Lesson {
    return new Lesson(
      memberkit.id,
      memberkit.title,
      memberkit.slug,
      memberkit.position,
      sectionId
    );
  }

  static videoToDomain(memberkit: MemberkitVideoDTO, lessonId: number): Video {
    return new Video(
      memberkit.id,
      memberkit.source || null,
      memberkit.uid || null,
      memberkit.duration || null,
      memberkit.image || null,
      lessonId
    );
  }
}
