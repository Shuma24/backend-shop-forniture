import { token } from 'brandi';
import { IAuthService } from '../auth/interfaces/auth.service.interface';
import { IJWTService } from '../auth/interfaces/jwt.service.interface';
import { BaseController } from '../common/abstract-class/base.controller';
import { IConfigService } from '../config/config.service.interface';
import { Application } from '../core/App';
import { IAuthHooks } from '../hooks/interfaces/user-hook.interface';

import { ILoggerService } from '../logger/logger.service.interface';
import { IDBService } from '../mongo/db.interface';
import { IUserService } from '../user/interfaces/user-service.interface';
import { UserRepository } from '../user/repository/user.repository';

export const TOKENS = {
  App: token<Application>('App'),
  Logger: token<ILoggerService>('Logger'),
  Config: token<IConfigService>('Config'),
  UserController: token<BaseController>('UserController'),
  DBService: token<IDBService>('DBService'),
  AuthController: token<BaseController>('AuthController'),
  UserRepository: token<UserRepository>('UserRepository'),
  AuthService: token<IAuthService>('AuthorizationService'),
  JWTService: token<IJWTService>('JWTService'),
  AuthHooks: token<IAuthHooks>('AuthHooks'),
  UserService: token<IUserService>('UserService'),
};
