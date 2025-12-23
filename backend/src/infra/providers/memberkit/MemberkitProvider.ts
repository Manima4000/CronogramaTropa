import { IMemberkitProvider } from '../../../shared/interfaces/IMemberkitProvider';
import { MemberkitCategoryDTO } from './dtos/MemberkitCategoryDTO';
import { MemberkitCourseDTO } from './dtos/MemberkitCourseDTO';
import { MemberkitSectionDTO } from './dtos/MemberkitSectionDTO';
import { MemberkitLessonDTO } from './dtos/MemberkitLessonDTO';
import { MemberkitClassroomDTO } from './dtos/MemberkitClassroomDTO';

// Dependency Inversion Principle (D do SOLID)
export class MemberkitProvider implements IMemberkitProvider {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.MEMBERKIT_API_URL || '';
    this.apiKey = process.env.MEMBERKIT_API_KEY || '';
  }

  private async fetch<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Memberkit API error: ${response.statusText}`);
    }

    return await response.json();
  }

  async getCategories(): Promise<MemberkitCategoryDTO[]> {
    return await this.fetch<MemberkitCategoryDTO[]>('/categories');
  }

  async getCourses(): Promise<MemberkitCourseDTO[]> {
    return await this.fetch<MemberkitCourseDTO[]>('/courses');
  }

  async getCourseById(courseId: string): Promise<MemberkitCourseDTO> {
    return await this.fetch<MemberkitCourseDTO>(`/courses/${courseId}`);
  }

  async getSectionsByCourseId(courseId: string): Promise<MemberkitSectionDTO[]> {
    return await this.fetch<MemberkitSectionDTO[]>(`/courses/${courseId}/sections`);
  }

  async getLessonsBySectionId(sectionId: string): Promise<MemberkitLessonDTO[]> {
    return await this.fetch<MemberkitLessonDTO[]>(`/sections/${sectionId}/lessons`);
  }

  async getClassrooms(): Promise<MemberkitClassroomDTO[]> {
    return await this.fetch<MemberkitClassroomDTO[]>('/classrooms');
  }
}
