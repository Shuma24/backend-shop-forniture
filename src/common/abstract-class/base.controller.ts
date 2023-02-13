import { RouteOptions } from 'fastify';
import { ILoggerService } from '../../logger/logger.service.interface';

export abstract class BaseController {
  private _route: RouteOptions[];

  constructor(private logger: ILoggerService) {
    this._route = [];
  }

  protected bindRouts(routes: RouteOptions[]) {
    routes.forEach((route) => {
      this.logger.info(`Route ${route.method} ${route.url} is binded`);
      this._route = [...this._route, route];
    });
  }

  public get route(): RouteOptions[] {
    return this._route;
  }
}
