import { MemberkitCourseDTO } from '../../infra/providers/memberkit/dtos/MemberkitCourseDTO';
import { MemberkitLessonDTO } from '../../infra/providers/memberkit/dtos/MemberkitLessonDTO';
import { MemberkitClassroomDTO } from '../../infra/providers/memberkit/dtos/MemberkitClassroomDTO';

// Dependency Inversion Principle (D do SOLID)
// A camada de domínio define a interface, a infra implementa
export interface IMemberkitProvider {
  getCourses(): Promise<MemberkitCourseDTO[]>;
  getCourseById(courseId: number): Promise<MemberkitCourseDTO>;
  getLessonById(courseId: number, lessonId: number): Promise<MemberkitLessonDTO>;
  getClassrooms(): Promise<MemberkitClassroomDTO[]>;
  getClassroomById(classroomId: number): Promise<MemberkitClassroomDTO>;
}
