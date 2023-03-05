import { injected } from 'brandi';
import { RouteOptions } from 'fastify';
import { FastifyReply } from 'fastify/types/reply';
import { FastifyRequest } from 'fastify/types/request';
import { BaseController } from '../common/abstract-class/base.controller';
import { userErrors } from '../common/constants/Errors';
import { HttpResponseCode } from '../common/constants/HttpResponseCode';
import { TOKENS } from '../containers/Symbols';
import { ILoggerService } from '../logger/logger.service.interface';
import { LoginResponseDto, LoginUserDto, UserLoginBody } from '../user/dto/login-user.dto';
import { LogoutResponseDto } from '../user/dto/logout-response.dto';
import {
  RegistrationResponse,
  RegistrationUserDto,
  UserRegistrationBody,
} from '../user/dto/registration-user.dto';

import { IAuthService } from './interfaces/auth.service.interface';

export class AuthController extends BaseController {
  constructor(private readonly Logger: ILoggerService, private readonly authService: IAuthService) {
    super(Logger);

    this.bindRouts([
      <RouteOptions>{
        method: 'POST',
        url: '/auth/register',
        handler: this.registration.bind(this),
        schema: {
          body: RegistrationUserDto,
          response: {
            201: RegistrationResponse,
          },
        },
      },
      <RouteOptions>{
        method: 'POST',
        url: '/auth/login',
        handler: this.login.bind(this),
        schema: {
          body: LoginUserDto,
          response: {
            200: LoginResponseDto,
          },
        },
      },
      {
        method: 'POST',
        url: '/auth/refresh',
        handler: this.refresh.bind(this),
        schema: {
          response: {
            200: LoginResponseDto,
          },
        },
      },
      {
        method: 'POST',
        url: '/auth/logout',
        handler: this.logout.bind(this),
        schema: {
          response: {
            200: LogoutResponseDto,
          },
        },
      },
    ]);

    this.Logger.info('AuthController is initialized.');
  }

  async registration(req: FastifyRequest<{ Body: UserRegistrationBody }>, reply: FastifyReply) {
    try {
      const newUser = await this.authService.reg(req.body.email, req.body.password, req.body.name);

      if (!newUser)
        return reply
          .code(HttpResponseCode.BAD_REQUEST)
          .send({ status: false, statusCode: HttpResponseCode.BAD_REQUEST });

      return reply
        .code(HttpResponseCode.CREATED)
        .send({ email: newUser.email, status: true, statusCode: HttpResponseCode.CREATED });
    } catch (error) {
      if (error instanceof Error) {
        this.Logger.error(error.message);
        return reply.code(HttpResponseCode.BAD_REQUEST).send({
          status: false,
          statusCode: HttpResponseCode.BAD_REQUEST,
          message: error.message,
        });
      }
    }
  }

  async login(req: FastifyRequest<{ Body: UserLoginBody }>, reply: FastifyReply) {
    try {
      const user = await this.authService.validate(req.body.email, req.body.password);

      if (!user?._id.toString()) throw new Error(userErrors.INVALID_EMAIL_OR_PASSWORD);

      const userAgent = req.headers['user-agent'];
      if (!userAgent) throw new Error(userErrors.NO_USER_AGENT_IN_REQUEST);
      const deviceId = userAgent.split(' ')[0];

      const tokens = await this.authService.login(user._id, deviceId);

      if (!tokens) throw new Error(userErrors.PROBLEM_WITH_LOGIN);

      return reply
        .header('Authorization', `Bearer ${tokens.accessToken}`)
        .setCookie('refreshToken', tokens.refreshToken, {
          httpOnly: true,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        })
        .code(HttpResponseCode.OK)
        .send({ status: true, statusCode: HttpResponseCode.OK, accessToken: tokens.accessToken });
    } catch (error) {
      if (error instanceof Error) {
        this.Logger.error(error.message);
        return reply.code(HttpResponseCode.UNAUTHORIZED).send({
          status: false,
          statusCode: HttpResponseCode.UNAUTHORIZED,
          message: error.message,
        });
      }
    }
  }

  async refresh(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        throw new Error(userErrors.UNAUTHORIZED);
      }

      const tokens = await this.authService.refresh(refreshToken);

      if (!tokens) throw new Error(userErrors.PROBLEM_WITH_LOGIN);

      return reply
        .header('Authorization', `Bearer ${tokens.accessToken}`)
        .setCookie('refreshToken', tokens.refreshToken, {
          httpOnly: true,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        })
        .code(HttpResponseCode.OK)
        .send({ status: true, statusCode: HttpResponseCode.OK, accessToken: tokens.accessToken });
    } catch (error) {
      if (error instanceof Error) {
        this.Logger.error(error.message);
        return reply.code(HttpResponseCode.UNAUTHORIZED).send({
          status: false,
          statusCode: HttpResponseCode.UNAUTHORIZED,
          message: error.message,
        });
      }
    }
  }

  async logout(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        throw new Error(userErrors.UNAUTHORIZED);
      }

      return reply
        .header('Authorization', 'Bearer')
        .clearCookie('refreshToken')
        .code(HttpResponseCode.OK)
        .send({ status: true, statusCode: HttpResponseCode.OK });
    } catch (error) {
      if (error instanceof Error) {
        this.Logger.error(error.message);
        return reply.code(HttpResponseCode.UNAUTHORIZED).send({
          status: false,
          statusCode: HttpResponseCode.UNAUTHORIZED,
          message: error.message,
        });
      }
    }
  }
}

injected(AuthController, TOKENS.Logger, TOKENS.AuthService);
