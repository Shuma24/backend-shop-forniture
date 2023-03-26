import { FastifyReply } from 'fastify/types/reply';
import { FastifyRequest } from 'fastify/types/request';
import { productBodyDTO, queryParamsAllProductsDto } from '../dto/product.dto';

export interface IProductController {
  createCategory(req: FastifyRequest, reply: FastifyReply): Promise<void>;
  createProduct: (
    req: FastifyRequest<{ Body: productBodyDTO }>,
    reply: FastifyReply,
  ) => Promise<void>;
  findAll: (
    req: FastifyRequest<{ Querystring: queryParamsAllProductsDto }>,
    reply: FastifyReply,
  ) => Promise<void>;
  findOne: (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => Promise<void>;
  findProductsByCategory: (
    req: FastifyRequest<{
      Params: { category: string };
      Querystring: { page: string; limit: string };
    }>,
    reply: FastifyReply,
  ) => Promise<void>;
  findAllCategory(req: FastifyRequest, reply: FastifyReply): Promise<void>;
  deleteProduct: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
}
