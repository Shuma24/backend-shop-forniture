import { IUser } from './user.interface';

export interface IUserService {
  updateCurrentUser(
    currentUserId: string,
    name?: string,
    email?: string,
    password?: string,
  ): Promise<true | undefined>;
  deleteCurrentUser(userId: string): Promise<boolean | undefined>;
  profile(userId: string): Promise<Omit<IUser, 'passwordHash' | 'refreshTokens'> | undefined>;
}
