// DTO para mapear a resposta da API Memberkit para Section
export interface MemberkitSectionDTO {
  id: number;
  name: string;
  slug: string;
  position: number;
  lessons?: any[]; // Lessons vêm dentro da section no /courses/{id}
  // Outros campos que a API retorna mas não vamos armazenar
  [key: string]: any;
}

// DTO de saída (o que salvamos no banco)
export interface SectionDTO {
  id: number;
  name: string;
  slug: string;
  position: number;
  courseId: number;
}

// Mapper para converter MemberkitSectionDTO -> SectionDTO
export class SectionMapper {
  static toDomain(memberkit: MemberkitSectionDTO, courseId: number): SectionDTO {
    return {
      id: memberkit.id,
      name: memberkit.name,
      slug: memberkit.slug,
      position: memberkit.position,
      courseId,
    };
  }
}
