import winston from 'winston';
import { logConfiguration } from '../configurations/winston.configuration';
import { ILoggerService } from './logger.service.interface';

export class LoggerService implements ILoggerService {
  private readonly Logger: winston.Logger;

  constructor() {
    this.Logger = winston.createLogger(logConfiguration);
  }

  log(message: string): void {
    this.Logger.log('info', message);
  }

  error(message: string): void {
    this.Logger.log('error', message);
  }

  warn(message: string): void {
    this.Logger.log('warn', message);
  }
}
