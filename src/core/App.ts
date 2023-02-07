import { injected } from 'brandi';
import fastify, { FastifyInstance } from 'fastify';
import { BaseController } from '../common/abstract-class/base.controller';
import { IConfigService } from '../config/config.service.interface';
import { TOKENS } from '../containers/Symbols';
import { ILoggerService } from '../logger/logger.service.interface';

export class Application {
  app: FastifyInstance;
  port: number;

  constructor(
    private readonly Logger: ILoggerService,
    private readonly configService: IConfigService,
    private readonly userController: BaseController,
  ) {
    this.app = fastify();
    this.port = Number(configService.get('PORT')) || 3000;
  }

  bindRouts() {
    this.userController.route.forEach((route) => {
      this.app.route(route);
    });
  }

  init() {
    this.bindRouts();
    this.app.listen({ port: this.port }, (err: Error | null, adress: string) => {
      if (err) {
        this.Logger.error(err.message);
        process.exit(1);
      }

      this.Logger.log(`Server is running on ${adress}`);
    });
  }
}

injected(Application, TOKENS.Logger, TOKENS.Config, TOKENS.UserController);
