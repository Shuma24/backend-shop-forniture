import { ITokenPayload } from './token.interfaces';

export interface IJWTService {
  generateTokens: (
    userId: string,
    deviceId: string,
  ) => { accessToken: string; refreshToken: string };

  authenticateAccessToken: (accessToken: string) => string | undefined;

  authenticateRefreshToken: (refreshToken: string) => ITokenPayload | undefined;
}
