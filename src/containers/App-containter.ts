import { Container } from 'brandi';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { JWTService } from '../auth/jwt.service';
import { S3Storage } from '../aws/storage.service';
import { ConfigService } from '../config/config.service';
import { Application } from '../core/App';
import { AuthHooks } from '../hooks/user.hooks';
import { LoggerService } from '../logger/logger.service';
import { MongoService } from '../mongo/db.service';
import { ProductController } from '../product/product.controller';
import { ProductService } from '../product/product.service';
import { ProductRepository } from '../product/repository/product.repository';
import { UserController } from '../user/user.controller';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/repository/user.repository';
import { TOKENS } from './Symbols';

export class AppModule extends Container {
  constructor() {
    super();
    this.bind(TOKENS.App).toInstance(Application).inSingletonScope();
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
    this.bind(TOKENS.ProductController).toInstance(ProductController).inSingletonScope();
    this.bind(TOKENS.ProductService).toInstance(ProductService).inSingletonScope();
    this.bind(TOKENS.ProductRepository).toInstance(ProductRepository).inSingletonScope();
    this.bind(TOKENS.BucketStorage).toInstance(S3Storage).inSingletonScope();
  }
}
