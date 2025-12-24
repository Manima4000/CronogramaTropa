import axios, { type AxiosInstance, AxiosError } from 'axios';
import { API_CONFIG } from './config';
import type { ApiErrorDTO } from '../../dtos/common/ApiErrorDTO';

// Axios instance with interceptors (Single Responsibility Principle)
export class HttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create(API_CONFIG);
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor (add auth token in future)
    this.client.interceptors.request.use(
      (config) => {
        // Future: Add authorization header
        // const token = localStorage.getItem('token');
        // if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor (error handling)
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiErrorDTO>) => {
        const apiError: ApiErrorDTO = {
          message: error.response?.data?.message || error.message || 'Erro desconhecido',
          status: error.response?.status || 500,
        };
        return Promise.reject(apiError);
      }
    );
  }

  public getInstance(): AxiosInstance {
    return this.client;
  }
}

export const httpClient = new HttpClient().getInstance();
