import { injected } from 'brandi';
import { config, DotenvParseOutput } from 'dotenv';
import { TOKENS } from '../containers/Symbols';
import { ILoggerService } from '../logger/logger.service.interface';

import { IConfigService } from './config.service.interface';

export class ConfigService implements IConfigService {
  config: DotenvParseOutput;

  constructor(private readonly Logger: ILoggerService) {
    const { error, parsed } = config();
    if (error) throw new Error('.env is required.');

    if (!parsed) throw new Error('.env is empty');

    this.config = parsed;

    this.Logger.log('ConfigService is loaded.');
  }
  get(key: string): string {
    const result = this.config[key];
    if (!result) throw new Error('Key is required.');

    return result;
  }
}

injected(ConfigService, TOKENS.Logger);
