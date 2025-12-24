import type { AxiosInstance } from 'axios';
import type { IScheduleService } from './IScheduleService';
import type { CreateScheduleRequestDTO } from '../../dtos/schedule/CreateScheduleRequestDTO';
import type { ScheduleDTO } from '../../dtos/schedule/ScheduleDTO';
import type { ScheduleWithItemsDTO } from '../../dtos/schedule/ScheduleWithItemsDTO';
import { ENDPOINTS } from '../api/endpoints';

// Dependency Inversion: Depends on AxiosInstance abstraction, not concrete implementation
export class ScheduleService implements IScheduleService {
  private httpClient: AxiosInstance;
  constructor(httpClient: AxiosInstance) {
    this.httpClient = httpClient;
  }

  async create(data: CreateScheduleRequestDTO): Promise<ScheduleWithItemsDTO> {
    const response = await this.httpClient.post<ScheduleWithItemsDTO>(
      ENDPOINTS.schedules.base,
      data
    );
    return response.data;
  }

  async getById(id: number): Promise<ScheduleWithItemsDTO> {
    const response = await this.httpClient.get<ScheduleWithItemsDTO>(
      ENDPOINTS.schedules.byId(id)
    );
    return response.data;
  }

  async list(): Promise<ScheduleDTO[]> {
    const response = await this.httpClient.get<ScheduleDTO[]>(ENDPOINTS.schedules.base);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await this.httpClient.delete(ENDPOINTS.schedules.byId(id));
  }

  async exportToPDF(id: number): Promise<Blob> {
    const response = await this.httpClient.get(ENDPOINTS.schedules.exportPDF(id), {
      responseType: 'blob',
    });
    return response.data;
  }
}
