export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

export interface IRefreshToken {
  token: string;
  deviceId: string;
  tokenDieDate: Date;
}
export interface IUser {
  id?: string;
  name?: string;
  passwordHash: string;
  email: string;
  role: UserRole;
  refreshTokens?: IRefreshToken[];
}
