export interface UserDTO {
  id: number;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}
