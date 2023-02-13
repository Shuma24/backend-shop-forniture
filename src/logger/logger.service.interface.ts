export interface ILoggerService {
  info(message: string): void;
  error(message: string): void;
  warn(message: string): void;
}
