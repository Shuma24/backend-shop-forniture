import { injected } from 'brandi';
import { TOKENS } from '../containers/Symbols';
import { ILoggerService } from '../logger/logger.service.interface';
import { UserEntity } from '../user/entity/user.entity';
import { UserRole } from '../user/interfaces/user.interface';
import { userDocument } from '../user/models/user.model';
import { UserRepository } from '../user/repository/user.repository';

import { IAuthService } from './interfaces/auth.service.interface';

export class AuthService implements IAuthService {
  constructor(
    private readonly logger: ILoggerService,
    private readonly userRepository: UserRepository,
  ) {
    this.logger.info('AuthService is created');
  }

  async reg(
    email: string,
    password: string,
    name: string | undefined,
  ): Promise<userDocument | null> {
    const oldUser = await this.userRepository.findUserByEmail(email);

    if (!oldUser) {
      return null;
    }

    const newUserEntity = await new UserEntity({
      passwordHash: '',
      email: email,
      role: UserRole.User,
      name: name,
    }).setPassword(password);

    const newUser = await this.userRepository.createUser(newUserEntity);

    return newUser;
  }
  async validate(email: string, password: string): Promise<userDocument> {
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      throw new Error('Invalid email or password');
    }
    const userEntity = new UserEntity({
      passwordHash: user.passwordHash,
      email: user.email,
      role: user.role,
      name: user.name,
    });
    const isCorrectPassword = await userEntity.checkPassword(password);

    if (!isCorrectPassword) {
      throw new Error('Invalid email or password');
    }

    return user;
  }
  login(): Promise<never> {
    throw new Error('Method not implemented.');
  }
}

injected(AuthService, TOKENS.Logger, TOKENS.UserRepository);
