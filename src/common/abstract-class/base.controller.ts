import { preHandlerHookHandler, RouteOptions } from 'fastify';
import { ILoggerService } from '../../logger/logger.service.interface';

export abstract class BaseController {
  private _route: RouteOptions[];

  constructor(private logger: ILoggerService) {
    this._route = [];
  }

  protected bindRouts(routes: RouteOptions[]): void {
    routes.forEach((route) => {
      this.logger.info(`Route ${route.method} ${route.url} is binded`);

      this._route = [...this._route, route];
    });
  }

  bindPreHandler(hook: preHandlerHookHandler) {
    this._route = this._route.map((route) => {
      if (route.preHandler && Array.isArray(route.preHandler)) {
        route.preHandler.unshift(hook);
      }

      if (!route.preHandler) {
        route.preHandler = hook;
      }

      return {
        ...route,
      };
    });
  }

  public get route(): RouteOptions[] {
    return this._route;
  }
}
