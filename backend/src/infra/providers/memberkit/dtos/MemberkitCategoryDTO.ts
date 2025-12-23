// DTO para mapear a resposta da API Memberkit para Category
export interface MemberkitCategoryDTO {
  id: number;
  name: string;
  // Outros campos que a API retorna mas não vamos armazenar
  [key: string]: any;
}

// DTO de saída (o que salvamos no banco)
export interface CategoryDTO {
  id: number;
  name: string;
}

// Mapper para converter MemberkitCategoryDTO -> CategoryDTO
export class CategoryMapper {
  static toDomain(memberkit: MemberkitCategoryDTO): CategoryDTO {
    return {
      id: memberkit.id,
      name: memberkit.name,
    };
  }
}
