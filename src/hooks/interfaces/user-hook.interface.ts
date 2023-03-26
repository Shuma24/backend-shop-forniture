import { HookHandlerDoneFunction } from 'fastify/types/hooks';
import { FastifyReply } from 'fastify/types/reply';
import { FastifyRequest } from 'fastify/types/request';

export interface IAuthHooks {
  execute(request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction): void;

  authGuard(request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction): void;
}
