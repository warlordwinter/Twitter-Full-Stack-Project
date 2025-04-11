import { AuthTokenDto, UserDto } from 'tweeter-shared';

export interface IAuthDao {
  // User CRUD operations
  getUser(alias: string): Promise<UserDto | null>;
  createUser(user: UserDto, password: string): Promise<void>;
  updateUser(user: UserDto): Promise<void>;
  deleteUser(alias: string): Promise<void>;

  // AuthToken CRUD operations
  createAuthToken(
    token: string,
    alias: string,
    expiresAt: number
  ): Promise<void>;
  getAuthToken(
    token: string
  ): Promise<{ alias: string; expiresAt: number } | null>;
  deleteAuthToken(token: string): Promise<void>;

  // Password operations
  getPassword(alias: string): Promise<string | null>;
  updatePassword(alias: string, newPassword: string): Promise<void>;
}
