import { httpClient } from './api/httpClient';
import { ENDPOINTS } from './api/endpoints';
import type { LoginRequestDTO, LoginResponseDTO } from '../dtos/auth/LoginDTO';
import type { UserDTO } from '../dtos/auth/UserDTO';

export const authService = {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequestDTO): Promise<LoginResponseDTO> {
    const response = await httpClient.post<LoginResponseDTO>(
      ENDPOINTS.auth.login,
      credentials
    );
    return response.data;
  },

  /**
   * Logout user (clear auth cookie)
   */
  async logout(): Promise<void> {
    await httpClient.post(ENDPOINTS.auth.logout);
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<UserDTO> {
    const response = await httpClient.get<UserDTO>(ENDPOINTS.auth.me);
    return response.data;
  },
};
