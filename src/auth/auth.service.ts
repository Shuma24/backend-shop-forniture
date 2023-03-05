import { injected } from 'brandi';
import { Types } from 'mongoose';

import { TOKENS } from '../containers/Symbols';
import { ILoggerService } from '../logger/logger.service.interface';
import { UserEntity } from '../user/entity/user.entity';
import { UserRole } from '../user/interfaces/user.interface';
import { userDocument } from '../user/models/user.model';
import { UserRepository } from '../user/repository/user.repository';
import { userErrors } from '../common/constants/Errors';
import { IAuthService } from './interfaces/auth.service.interface';
import { IJWTService } from './interfaces/jwt.service.interface';

export class AuthService implements IAuthService {
  constructor(
    private readonly logger: ILoggerService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: IJWTService,
  ) {
    this.logger.info('AuthService is created');
  }

  async reg(
    email: string,
    password: string,
    name: string | undefined,
  ): Promise<userDocument | undefined> {
    try {
      const oldUser = await this.userRepository.findUserByEmail(email);

      if (oldUser) {
        throw new Error(userErrors.USER_ALREADY_EXISTS);
      }

      const newUserEntity = await new UserEntity({
        passwordHash: '',
        email: email,
        role: UserRole.User,
        name: name,
      }).setPassword(password);

      const newUser = await this.userRepository.createUser(newUserEntity);

      return newUser;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
  async validate(email: string, password: string): Promise<userDocument | undefined> {
    try {
      const user = await this.userRepository.findUserByEmail(email);

      if (!user) {
        throw new Error(userErrors.INVALID_EMAIL_OR_PASSWORD);
      }
      const userEntity = new UserEntity({
        passwordHash: user.passwordHash,
        email: user.email,
        role: user.role,
        name: user.name,
      });
      const isCorrectPassword = await userEntity.validatePassword(password);

      if (!isCorrectPassword) {
        throw new Error(userErrors.INVALID_EMAIL_OR_PASSWORD);
      }

      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
  async login(id: Types.ObjectId, deviceId: string) {
    try {
      const user = await this.userRepository.findUserById(id.toString());

      if (!user) {
        throw new Error(userErrors.PROBLEM_WITH_LOGIN);
      }

      const { accessToken, refreshToken } = this.jwtService.generateTokens(id.toString(), deviceId);
      const setTokenInfo = await this.userRepository.setToken(id, refreshToken, deviceId);

      user.refreshTokens = user.refreshTokens?.filter(
        (el) => el.token !== refreshToken && el.deviceId !== deviceId,
      );

      const timeNow = new Date(Date.now());
      user.refreshTokens = user.refreshTokens?.filter((el) => {
        return timeNow < el.tokenDieDate;
      });

      await user.save();

      if (!setTokenInfo.acknowledged) {
        throw new Error(userErrors.PROBLEM_WITH_LOGIN);
      }

      return { accessToken, refreshToken };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async refresh(userRefreshToken: string) {
    try {
      const user = await this.userRepository.findUserByToken(userRefreshToken);

      if (!user) {
        throw new Error(userErrors.PROBLEM_WITH_LOGIN);
      }

      const decoded = this.jwtService.authenticateRefreshToken(userRefreshToken);

      if (!decoded) {
        throw new Error(userErrors.PROBLEM_WITH_LOGIN);
      }

      const { userId, deviceId } = decoded;

      const isToken = user.refreshTokens?.find(
        (token) => token.token === userRefreshToken && token.deviceId === deviceId,
      );

      if (!isToken) {
        throw new Error(userErrors.PROBLEM_WITH_LOGIN);
      }

      const generatedTokens = this.jwtService.generateTokens(userId, deviceId);

      user.refreshTokens = user.refreshTokens?.filter(
        (el) => el.token !== userRefreshToken && el.deviceId !== deviceId,
      );

      const timeNow = new Date(Date.now());
      user.refreshTokens = user.refreshTokens?.filter((el) => {
        return timeNow < el.tokenDieDate;
      });

      user.refreshTokens?.push({
        token: generatedTokens.refreshToken,
        deviceId,
        tokenDieDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      });

      await user.save();
      return generatedTokens;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
}

injected(AuthService, TOKENS.Logger, TOKENS.UserRepository, TOKENS.JWTService);
