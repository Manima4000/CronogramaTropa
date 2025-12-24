import { Classroom } from '../../../../domains/classroom/entities/Classroom';

// DTO para mapear a resposta da API Memberkit para Classroom
export interface MemberkitClassroomDTO {
  id: number;
  name: string;
  course_name: string;
  users_count: number;
  // Outros campos que a API retorna mas não vamos armazenar
  [key: string]: any;
}

// Mapper para converter MemberkitClassroomDTO -> Classroom (Domain Entity)
export class ClassroomMapper {
  static toDomain(memberkit: MemberkitClassroomDTO): Classroom {
    return new Classroom(
      memberkit.id,
      memberkit.name,
      memberkit.course_name,
      memberkit.users_count
    );
  }
}
