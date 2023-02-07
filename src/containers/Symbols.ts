import { token } from 'brandi';
import { BaseController } from '../common/abstract-class/base.controller';
import { IConfigService } from '../config/config.service.interface';
import { Application } from '../core/App';
import { ILoggerService } from '../logger/logger.service.interface';

export const TOKENS = {
  App: token<Application>('App'),
  Logger: token<ILoggerService>('Logger'),
  Config: token<IConfigService>('Config'),
  UserController: token<BaseController>('UserController'),
};
