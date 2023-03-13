import { FastifyReply } from 'fastify/types/reply';
import { FastifyRequest } from 'fastify/types/request';
import { productBodyDTO } from '../dto/product.dto';

export interface IProductController {
  createCategory(req: FastifyRequest, reply: FastifyReply): Promise<void>;
  createProduct: (
    req: FastifyRequest<{ Body: productBodyDTO }>,
    reply: FastifyReply,
  ) => Promise<void>;
  findAll: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  findOne: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  deleteProduct: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
}
