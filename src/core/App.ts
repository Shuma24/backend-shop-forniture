import cors, { FastifyCorsOptions } from '@fastify/cors';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { injected } from 'brandi';
import fastify, { FastifyInstance } from 'fastify';
import mongoose, { Mongoose } from 'mongoose';
import type { FastifyCookieOptions } from '@fastify/cookie';
import cookie from '@fastify/cookie';
import { BaseController } from '../common/abstract-class/base.controller';
import { IConfigService } from '../config/config.service.interface';
import { TOKENS } from '../containers/Symbols';
import { ILoggerService } from '../logger/logger.service.interface';
import { IDBService } from '../mongo/db.interface';
import { IAuthHooks } from '../hooks/interfaces/user-hook.interface';

export class Application {
  app: FastifyInstance;
  port: number;
  mongoClient: Mongoose;
  routes: BaseController[];

  constructor(
    private readonly Logger: ILoggerService,
    private readonly configService: IConfigService,
    private readonly userController: BaseController,
    private readonly dbService: IDBService,
    private readonly authController: BaseController,
    private readonly AuthHooks: IAuthHooks,
  ) {
    this.app = fastify().withTypeProvider<TypeBoxTypeProvider>();
    this.port = Number(configService.get('PORT')) || 5000;
    this.mongoClient = mongoose;
    this.routes = [userController, authController];
  }

  bindRouts() {
    this.routes.forEach((controllers) => {
      controllers.bindPreHandler(this.AuthHooks.execute.bind(this.AuthHooks));
      controllers.route.forEach((route) => {
        this.app.route(route);
      });
    });
  }

  connectDataBase() {
    try {
      this.dbService.connect();
      this.Logger.info('DataBase is connected.');
    } catch (error) {
      if (error instanceof Error) {
        this.Logger.error(error.message);
      }
    }
  }

  async cors(option: FastifyCorsOptions) {
    await this.app.register(cors, option);
  }

  async cookie() {
    await this.app.register(cookie, {
      secret: this.configService.get('COOKIE_SECRET'),
      parseOptions: {
        httpOnly: true,
        secure: false,
        path: '/',
        sameSite: 'strict',
      },
    } as FastifyCookieOptions);
  }

  init() {
    this.app.listen({ port: this.port, path: '0.0.0.0' }, (err: Error | null, address: string) => {
      if (err) {
        this.Logger.error(err.message);
        process.exit(1);
      }
      this.Logger.info(`Server is running on ${address}`);
    });
    this.connectDataBase();
    this.bindRouts();
    this.cookie();
  }
}

injected(
  Application,
  TOKENS.Logger,
  TOKENS.Config,
  TOKENS.UserController,
  TOKENS.DBService,
  TOKENS.AuthController,
  TOKENS.AuthHooks,
);
