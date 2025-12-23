// DTO para mapear a resposta da API Memberkit para Classroom
export interface MemberkitClassroomDTO {
  id: number;
  name: string;
  course_name: string;
  user_count: number;
  // Outros campos que a API retorna mas não vamos armazenar
  [key: string]: any;
}

// DTO de saída (o que salvamos no banco)
export interface ClassroomDTO {
  id: number;
  name: string;
  courseName: string;
  userCount: number;
}

// Mapper para converter MemberkitClassroomDTO -> ClassroomDTO
export class ClassroomMapper {
  static toDomain(memberkit: MemberkitClassroomDTO): ClassroomDTO {
    return {
      id: memberkit.id,
      name: memberkit.name,
      courseName: memberkit.course_name,
      userCount: memberkit.user_count,
    };
  }
}
