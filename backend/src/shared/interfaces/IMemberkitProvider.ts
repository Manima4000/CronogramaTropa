import { MemberkitCategoryDTO } from '../../infra/providers/memberkit/dtos/MemberkitCategoryDTO';
import { MemberkitCourseDTO } from '../../infra/providers/memberkit/dtos/MemberkitCourseDTO';
import { MemberkitSectionDTO } from '../../infra/providers/memberkit/dtos/MemberkitSectionDTO';
import { MemberkitLessonDTO } from '../../infra/providers/memberkit/dtos/MemberkitLessonDTO';
import { MemberkitClassroomDTO } from '../../infra/providers/memberkit/dtos/MemberkitClassroomDTO';

// Dependency Inversion Principle (D do SOLID)
// A camada de domínio define a interface, a infra implementa
export interface IMemberkitProvider {
  getCategories(): Promise<MemberkitCategoryDTO[]>;
  getCourses(): Promise<MemberkitCourseDTO[]>;
  getCourseById(courseId: string): Promise<MemberkitCourseDTO>;
  getSectionsByCourseId(courseId: string): Promise<MemberkitSectionDTO[]>;
  getLessonsBySectionId(sectionId: string): Promise<MemberkitLessonDTO[]>;
  getClassrooms(): Promise<MemberkitClassroomDTO[]>;
}
