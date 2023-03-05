import { HookHandlerDoneFunction } from 'fastify/types/hooks';
import { FastifyReply } from 'fastify/types/reply';
import { FastifyRequest } from 'fastify/types/request';

export interface IAuthHooks {
  /*  checkTokenSaveUser: (
    request: FastifyRequest,
    reply: FastifyReply,
    done: HookHandlerDoneFunction,
  ) => void;
 */
  /* isAuthGuard(request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction): void; */

  execute(request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction): void;

  authGuard(request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction): void;
}
