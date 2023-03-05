import { injected } from 'brandi';
import { userErrors } from '../../common/constants/Errors';
import { TOKENS } from '../../containers/Symbols';
import { ILoggerService } from '../../logger/logger.service.interface';
import { UserEntity } from '../entity/user.entity';
import { IUserService } from '../interfaces/user-service.interface';
import { IUser } from '../interfaces/user.interface';
import { UserRepository } from '../repository/user.repository';

export class UserService implements IUserService {
  constructor(
    private readonly logger: ILoggerService,
    private readonly userRepository: UserRepository,
  ) {
    this.logger.info('UserService is initialized.');
  }

  async updateCurrentUser(
    currentUserId: string,
    name?: string,
    email?: string,
    password?: string,
  ): Promise<true | undefined> {
    try {
      if (!currentUserId) {
        throw new Error(userErrors.USER_NOT_FOUND);
      }
      const userToUpdate = await this.userRepository.findUserById(currentUserId);

      if (!userToUpdate) {
        throw new Error(userErrors.USER_NOT_FOUND);
      }

      const userEntity = new UserEntity({
        id: userToUpdate._id.toString(),
        name: name ? name : userToUpdate.name,
        email: email ? email : userToUpdate.email,
        passwordHash: userToUpdate.passwordHash,
        role: userToUpdate.role,
      });

      password ? await userEntity.setPassword(password) : null;

      userToUpdate.name = userEntity.name;
      userToUpdate.email = userEntity.email;
      userToUpdate.passwordHash = userEntity.passwordHash;

      await userToUpdate.save();

      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async deleteCurrentUser(userId: string): Promise<boolean | undefined> {
    try {
      if (!userId) {
        throw new Error(userErrors.USER_NOT_FOUND);
      }

      const user = await this.userRepository.deleteUser(userId);

      if (!user.acknowledged) {
        throw new Error(userErrors.USER_NOT_FOUND);
      }

      return user.acknowledged;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
  async profile(
    userId: string,
  ): Promise<Omit<IUser, 'passwordHash' | 'refreshTokens'> | undefined> {
    try {
      if (!userId) {
        throw new Error(userErrors.USER_NOT_FOUND);
      }

      const user = await this.userRepository.findUserById(userId);

      if (!user) {
        throw new Error(userErrors.USER_NOT_FOUND);
      }

      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
}

injected(UserService, TOKENS.Logger, TOKENS.UserRepository);
