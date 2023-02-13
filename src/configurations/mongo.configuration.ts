import { IConfigService } from '../config/config.service.interface';

export const getMongoString = (configService: IConfigService): string => {
  const user = configService.get('MONGO_USER');
  const password = configService.get('MONGO_PASSWORD');
  const host = configService.get('MONGO_HOST');
  const port = configService.get('MONGO_PORT');
  const database = configService.get('MONGO_DATABASE');

  return `mongodb://${user}:${password}@${host}:${port}/${database}?authSource=admin`;
};
