import type { SectionDTO } from '../../dtos/course/SectionDTO';

export interface ISectionService {
  listByCourse(courseId: number): Promise<SectionDTO[]>;
}
