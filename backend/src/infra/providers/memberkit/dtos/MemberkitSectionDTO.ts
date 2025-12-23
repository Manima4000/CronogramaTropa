// DTO para mapear a resposta da API Memberkit para Section
export interface MemberkitSectionDTO {
  id: string;
  name: string;
  slug: string;
  position: number;
  // Outros campos que a API retorna mas não vamos armazenar
  [key: string]: any;
}

// DTO de saída (o que salvamos no banco)
export interface SectionDTO {
  id: string;
  name: string;
  slug: string;
  position: number;
  courseId: string;
}

// Mapper para converter MemberkitSectionDTO -> SectionDTO
export class SectionMapper {
  static toDomain(memberkit: MemberkitSectionDTO, courseId: string): SectionDTO {
    return {
      id: memberkit.id,
      name: memberkit.name,
      slug: memberkit.slug,
      position: memberkit.position,
      courseId,
    };
  }
}
