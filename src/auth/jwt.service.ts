import { injected } from 'brandi';
import JWT from 'jsonwebtoken';

import { IConfigService } from '../config/config.service.interface';
import { TOKENS } from '../containers/Symbols';
import { ILoggerService } from '../logger/logger.service.interface';
import { IJWTService } from './interfaces/jwt.service.interface';
import { ITokenPayload } from './interfaces/token.interfaces';

export class JWTService implements IJWTService {
  private readonly jwtInstance: typeof JWT;
  private readonly jwtTokenSecret: string;
  private readonly jwtRefreshTokenSecret: string;

  constructor(
    private readonly configService: IConfigService,
    private readonly logger: ILoggerService,
  ) {
    this.jwtInstance = JWT;
    this.jwtTokenSecret = configService.get('ACCESS_TOKEN_SECRET');
    this.jwtRefreshTokenSecret = configService.get('REFRESH_TOKEN_SECRET');

    this.logger.info('JWTService initialized');
  }

  generateTokens(
    userId: string,
    deviceId: string,
  ): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = this.jwtInstance.sign({ userId, deviceId }, this.jwtTokenSecret, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwtInstance.sign({ userId, deviceId }, this.jwtRefreshTokenSecret, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  authenticateAccessToken(accessToken: string): string | undefined {
    try {
      const decoded = this.jwtInstance.verify(accessToken, this.jwtTokenSecret) as ITokenPayload;

      return decoded.userId;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  authenticateRefreshToken(refreshToken: string): ITokenPayload | undefined {
    try {
      const decoded = this.jwtInstance.verify(
        refreshToken,
        this.jwtRefreshTokenSecret,
      ) as ITokenPayload;

      return decoded;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
}

injected(JWTService, TOKENS.Config, TOKENS.Logger);
