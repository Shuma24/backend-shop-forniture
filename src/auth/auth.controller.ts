import { injected } from 'brandi';
import { RouteOptions } from 'fastify';
import { FastifyReply } from 'fastify/types/reply';
import { FastifyRequest } from 'fastify/types/request';
import { BaseController } from '../common/abstract-class/base.controller';
import { HttpResponseCode } from '../common/constants/HttpResponseCode';
import { TOKENS } from '../containers/Symbols';
import { ILoggerService } from '../logger/logger.service.interface';
import { RegistrationUserDto, UserRegistrationBody } from '../user/dto/registration-user.dto';
import { IAuthService } from './interfaces/auth.service.interface';

export class AuthController extends BaseController {
  constructor(private readonly Logger: ILoggerService, private readonly authService: IAuthService) {
    super(Logger);

    this.bindRouts([
      <RouteOptions>{
        method: 'POST',
        url: '/reg',
        handler: this.registration.bind(this),
        schema: {
          body: RegistrationUserDto,
          response: {
            200: RegistrationUserDto,
          },
        },
      },
      {
        method: 'POST',
        url: '/login',
        handler: this.login.bind(this),
        schema: {},
      },
    ]);

    this.Logger.info('AuthController is loaded.');
  }

  async registration(req: FastifyRequest<{ Body: UserRegistrationBody }>, reply: FastifyReply) {
    const newUser = await this.authService.reg(req.body.email, req.body.password, req.body.name);

    if (!newUser)
      return reply
        .code(HttpResponseCode.BAD_REQUEST)
        .send({ status: false, statusCode: HttpResponseCode.BAD_REQUEST });

    return reply
      .code(HttpResponseCode.CREATED)
      .send({ email: newUser.email, status: true, statusCode: HttpResponseCode.CREATED });
  }

  async login(req: FastifyRequest, reply: FastifyReply) {
    return reply.send(this.authService.login()).code(HttpResponseCode.BAD_REQUEST);
  }
}

injected(AuthController, TOKENS.Logger, TOKENS.AuthService);
