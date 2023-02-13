import { injected } from 'brandi';
import { FastifyReply, FastifyRequest } from 'fastify';
import { IAuthService } from '../../auth/interfaces/auth.service.interface';
import { BaseController } from '../../common/abstract-class/base.controller';
import { HttpResponseCode } from '../../common/constants/HttpResponseCode';
import { TOKENS } from '../../containers/Symbols';
import { ILoggerService } from '../../logger/logger.service.interface';
import { IUserController } from '../controller/user.controller.interface';

export class UserController extends BaseController implements IUserController {
  constructor(private Logger: ILoggerService) {
    super(Logger);
    this.bindRouts([
      {
        method: 'GET',
        url: '/',
        handler: this.sendTestMessage,
      },
    ]);

    this.Logger.info('UserController is loaded.');
  }

  async sendTestMessage(req: FastifyRequest, reply: FastifyReply) {
    return reply.send('hello').code(HttpResponseCode.OK);
  }
}

injected(UserController, TOKENS.Logger);
