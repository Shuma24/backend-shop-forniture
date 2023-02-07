import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';

export interface IUserController {
  sendTestMessage(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
  route?: RouteOptions[];
}
