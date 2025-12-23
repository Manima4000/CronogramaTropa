import { IMemberkitProvider } from '../../../shared/interfaces/IMemberkitProvider';
import { MemberkitCourseDTO } from './dtos/MemberkitCourseDTO';
import { MemberkitLessonDTO } from './dtos/MemberkitLessonDTO';
import { MemberkitClassroomDTO } from './dtos/MemberkitClassroomDTO';

// Dependency Inversion Principle (D do SOLID)
export class MemberkitProvider implements IMemberkitProvider {
  private baseUrl: string;
  private apiKey: string;
  private requestTimestamps: number[] = [];
  private readonly MAX_REQUESTS_PER_MINUTE = 120;

  constructor() {
    this.baseUrl = process.env.MEMBERKIT_API_URL || '';
    this.apiKey = process.env.MEMBERKIT_API_KEY || '';
  }

  /**
   * Implementa rate limiting para respeitar o limite de 120 requisições/minuto da API Memberkit
   */
  private async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const oneMinuteAgo = now - 60000; // 60 segundos em ms

    // Remove requisições antigas (mais de 1 minuto)
    this.requestTimestamps = this.requestTimestamps.filter(
      timestamp => timestamp > oneMinuteAgo
    );

    // Se atingimos o limite, espera até poder fazer nova requisição
    if (this.requestTimestamps.length >= this.MAX_REQUESTS_PER_MINUTE) {
      const oldestRequest = this.requestTimestamps[0];
      const waitTime = oldestRequest + 60000 - now + 100; // +100ms de margem

      if (waitTime > 0) {
        console.log(`Rate limit atingido. Aguardando ${Math.ceil(waitTime / 1000)}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    // Registra nova requisição
    this.requestTimestamps.push(Date.now());
  }

  private async fetch<T>(endpoint: string): Promise<T> {
    // Aguarda rate limiting antes de fazer requisição
    await this.waitForRateLimit();

    // Adiciona api_key como query parameter
    const separator = endpoint.includes('?') ? '&' : '?';
    const url = `${this.baseUrl}${endpoint}${separator}api_key=${this.apiKey}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Memberkit API error: ${response.statusText}`);
    }

    return await response.json();
  }

  async getCourses(): Promise<MemberkitCourseDTO[]> {
    return await this.fetch<MemberkitCourseDTO[]>('/courses');
  }

  async getCourseById(courseId: number): Promise<MemberkitCourseDTO> {
    return await this.fetch<MemberkitCourseDTO>(`/courses/${courseId}`);
  }

  async getLessonById(courseId: number, lessonId: number): Promise<MemberkitLessonDTO> {
    return await this.fetch<MemberkitLessonDTO>(`/courses/${courseId}/lessons/${lessonId}`);
  }

  async getClassrooms(): Promise<MemberkitClassroomDTO[]> {
    return await this.fetch<MemberkitClassroomDTO[]>('/classrooms');
  }

  async getClassroomById(classroomId: number): Promise<MemberkitClassroomDTO> {
    return await this.fetch<MemberkitClassroomDTO>(`/classrooms/${classroomId}`);
  }
}
