import { Container } from 'brandi';
import { ConfigService } from '../config/config.service';
import { Application } from '../core/App';
import { LoggerService } from '../logger/logger.service';
import { UserController } from '../user/user.controller';
import { TOKENS } from './Symbols';

export class AppModule extends Container {
  constructor() {
    super();
    this.bind(TOKENS.App).toInstance(Application).inTransientScope();
    this.bind(TOKENS.Logger).toInstance(LoggerService).inSingletonScope();
    this.bind(TOKENS.Config).toInstance(ConfigService).inSingletonScope();
    this.bind(TOKENS.UserController).toInstance(UserController).inSingletonScope();
  }
}
