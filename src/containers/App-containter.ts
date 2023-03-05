import { Container } from 'brandi';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { JWTService } from '../auth/jwt.service';
import { ConfigService } from '../config/config.service';
import { Application } from '../core/App';
import { AuthHooks } from '../hooks/user.hooks';
import { LoggerService } from '../logger/logger.service';
import { MongoService } from '../mongo/db.service';
import { UserController } from '../user/controller/user.controller';
import { UserService } from '../user/controller/user.service';
import { UserRepository } from '../user/repository/user.repository';
import { TOKENS } from './Symbols';

export class AppModule extends Container {
  constructor() {
    super();
    this.bind(TOKENS.App).toInstance(Application).inTransientScope();
    this.bind(TOKENS.Logger).toInstance(LoggerService).inSingletonScope();
    this.bind(TOKENS.Config).toInstance(ConfigService).inSingletonScope();
    this.bind(TOKENS.UserController).toInstance(UserController).inSingletonScope();
    this.bind(TOKENS.DBService).toInstance(MongoService).inSingletonScope();
    this.bind(TOKENS.AuthController).toInstance(AuthController).inSingletonScope();
    this.bind(TOKENS.UserRepository).toInstance(UserRepository).inSingletonScope();
    this.bind(TOKENS.AuthService).toInstance(AuthService).inSingletonScope();
    this.bind(TOKENS.JWTService).toInstance(JWTService).inSingletonScope();
    this.bind(TOKENS.AuthHooks).toInstance(AuthHooks).inSingletonScope();
    this.bind(TOKENS.UserService).toInstance(UserService).inSingletonScope();
  }
}
