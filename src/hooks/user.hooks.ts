import { injected } from 'brandi';
import { HookHandlerDoneFunction } from 'fastify/types/hooks';
import { FastifyReply } from 'fastify/types/reply';
import { FastifyRequest } from 'fastify/types/request';
import { IJWTService } from '../auth/interfaces/jwt.service.interface';
import { userErrors } from '../common/constants/Errors';
import { HttpResponseCode } from '../common/constants/HttpResponseCode';
import { TOKENS } from '../containers/Symbols';
import { ILoggerService } from '../logger/logger.service.interface';
import { IAuthHooks } from './interfaces/user-hook.interface';

declare module 'fastify' {
  interface FastifyRequest {
    user?: string;
  }
}

export class AuthHooks implements IAuthHooks {
  constructor(private readonly jwt: IJWTService, private readonly logger: ILoggerService) {
    this.logger.info('AuthHooks is initialized.');
  }

  execute(request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) {
    try {
      if (request.headers.authorization) {
        const token = request.headers.authorization.split(' ')[1];
        const decoded = this.jwt.authenticateAccessToken(token);
        if (!decoded) done();
        request.user = decoded;
        done();
      }
      done();
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message);
        done();
      }
    }
  }

  authGuard(request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) {
    try {
      if (!request.user) {
        return reply
          .code(HttpResponseCode.UNAUTHORIZED)
          .send({ status: false, error: userErrors.UNAUTHORIZED });
      }
      done();
    } catch (error) {
      if (error instanceof Error) {
        return reply
          .send({ status: false, error: error.message })
          .code(HttpResponseCode.INTERNAL_SERVER);
      }
    }
  }
}

injected(AuthHooks, TOKENS.JWTService, TOKENS.Logger);
