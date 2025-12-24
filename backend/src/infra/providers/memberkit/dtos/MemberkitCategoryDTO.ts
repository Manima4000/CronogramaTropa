import { Category } from '../../../../domains/category/entities/Category';

// DTO para mapear a resposta da API Memberkit para Category
export interface MemberkitCategoryDTO {
  id: number;
  name: string;
  // Outros campos que a API retorna mas não vamos armazenar
  [key: string]: any;
}

// Mapper para converter MemberkitCategoryDTO -> Category (Domain Entity)
export class CategoryMapper {
  static toDomain(memberkit: MemberkitCategoryDTO): Category {
    return new Category(
      memberkit.id,
      memberkit.name
    );
  }
}
