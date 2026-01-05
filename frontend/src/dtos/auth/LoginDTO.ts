import type { UserDTO } from './UserDTO';

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  user: UserDTO;
}

export interface RegisterRequestDTO {
  email: string;
  password: string;
  role?: 'admin' | 'user';
}
