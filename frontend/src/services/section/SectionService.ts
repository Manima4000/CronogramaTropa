import type { AxiosInstance } from 'axios';
import type { ISectionService } from './ISectionService';
import type { SectionDTO } from '../../dtos/course/SectionDTO';

export class SectionService implements ISectionService {
  private httpClient: AxiosInstance;

  constructor(httpClient: AxiosInstance) {
    this.httpClient = httpClient;
  }

  async listByCourse(courseId: number): Promise<SectionDTO[]> {
    const response = await this.httpClient.get<SectionDTO[]>(
      `/api/sections/course/${courseId}`
    );
    return response.data;
  }
}
