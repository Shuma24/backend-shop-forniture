import { injected } from 'brandi';
import mongoose, { Mongoose } from 'mongoose';
import { IConfigService } from '../config/config.service.interface';
import { getMongoString } from '../configurations/mongo.configuration';
import { TOKENS } from '../containers/Symbols';
import { ILoggerService } from '../logger/logger.service.interface';
import { IDBService } from './db.interface';

export class MongoService implements IDBService {
  mongoClient: Mongoose;
  constructor(
    private readonly configService: IConfigService,
    private readonly logger: ILoggerService,
  ) {
    this.mongoClient = mongoose;
    this.logger.info('DataBase is initialized');
  }

  async connect() {
    this.mongoClient.set('strictQuery', true);
    await this.mongoClient.connect(getMongoString(this.configService));
  }
}

injected(MongoService, TOKENS.Config, TOKENS.Logger);
