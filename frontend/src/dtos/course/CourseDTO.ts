export interface CourseDTO {
  id: number;
  name: string;
  position: number;
  description: string | null;
  imageUrl: string | null;
  categoryId: number;
}
