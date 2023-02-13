export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

export interface IUser {
  id?: string;
  name?: string;
  passwordHash: string;
  email: string;
  role: UserRole;
}
