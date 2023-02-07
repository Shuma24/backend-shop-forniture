import { injected } from 'brandi';
import { FastifyReply, FastifyRequest } from 'fastify';
import { BaseController } from '../common/abstract-class/base.controller';
import { HttpResponseCode } from '../common/constants/HttpResopnseCode';
import { TOKENS } from '../containers/Symbols';
import { ILoggerService } from '../logger/logger.service.interface';
import { IUserController } from './user.controller.interface';

export class UserController extends BaseController implements IUserController {
  constructor(private Logger: ILoggerService) {
    super(Logger);
    this.bindRouts([
      {
        method: 'GET',
        url: '/hello',
        handler: this.sendTestMessage,
      },
    ]);

    this.Logger.log('UserController is loaded.');
  }

  async sendTestMessage(req: FastifyRequest, reply: FastifyReply) {
    return reply.code(HttpResponseCode.OK).send('hello world');
  }
}

injected(UserController, TOKENS.Logger);
