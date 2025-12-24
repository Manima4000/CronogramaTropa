import { ISectionRepository } from '../repositories/ISectionRepository';
import { Section } from '../entities/Section';

export class GetSectionsByCourseIdUseCase {
  constructor(private sectionRepository: ISectionRepository) {}

  async execute(courseId: number): Promise<Section[]> {
    return await this.sectionRepository.findByCourseId(courseId);
  }
}
