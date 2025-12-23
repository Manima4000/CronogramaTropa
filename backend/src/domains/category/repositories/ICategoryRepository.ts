export interface Category {
  id: number;
  name: string;
}

export interface ICategoryRepository {
  create(category: Category): Promise<Category>;
  createMany(categories: Category[]): Promise<void>;
  findAll(): Promise<Category[]>;
  findById(id: number): Promise<Category | null>;
  update(id: number, data: Partial<Category>): Promise<Category>;
  delete(id: number): Promise<void>;
}
