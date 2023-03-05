import { FastifyReply, FastifyRequest } from 'fastify';

export interface IUserController {
  updateCurrentUser(req: FastifyRequest, reply: FastifyReply): Promise<undefined>;
  userProfileInfo(req: FastifyRequest, reply: FastifyReply): Promise<undefined>;
  deleteCurrentUser(req: FastifyRequest, reply: FastifyReply): Promise<undefined>;
}
