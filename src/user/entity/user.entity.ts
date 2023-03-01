import { compare, genSalt, hash } from 'bcrypt';
import { IUser, UserRole } from '../interfaces/user.interface';

export class UserEntity implements IUser {
  id?: string | undefined;
  name?: string | undefined;
  passwordHash: string;
  email: string;
  role: UserRole;

  constructor(user: IUser) {
    this.id = user.id;
    this.name = user.name;
    this.passwordHash = user.passwordHash;
    this.email = user.email;
    this.role = user.role;
  }

  public async setPassword(password: string): Promise<this> {
    const salt = await genSalt(10);
    this.passwordHash = await hash(password, salt);
    return this;
  }

  public async validatePassword(password: string): Promise<boolean> {
    return await compare(password, this.passwordHash);
  }
}
