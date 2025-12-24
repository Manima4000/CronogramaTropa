import type { AxiosInstance } from 'axios';
import type { ICourseService } from './ICourseService';
import type { CourseDTO } from '../../dtos/course/CourseDTO';
import { ENDPOINTS } from '../api/endpoints';

export class CourseService implements ICourseService {
  private httpClient: AxiosInstance
  constructor(httpClient: AxiosInstance) {
    this.httpClient = httpClient;
  }

  async list(): Promise<CourseDTO[]> {
    const response = await this.httpClient.get<CourseDTO[]>(ENDPOINTS.courses.base);
    return response.data;
  }

  async getById(id: number): Promise<CourseDTO> {
    const response = await this.httpClient.get<CourseDTO>(ENDPOINTS.courses.byId(id));
    return response.data;
  }
}
