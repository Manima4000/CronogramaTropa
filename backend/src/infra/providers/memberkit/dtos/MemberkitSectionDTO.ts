import { Section } from '../../../../domains/section/entities/Section';

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

// Mapper para converter MemberkitSectionDTO -> Section (Domain Entity)
export class SectionMapper {
  static toDomain(memberkit: MemberkitSectionDTO, courseId: number): Section {
    return new Section(
      memberkit.id,
      memberkit.name,
      memberkit.slug,
      memberkit.position,
      courseId
    );
  }
}
