import { injected } from 'brandi';
import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify';

import { BaseController } from '../common/abstract-class/base.controller';
import { productErrors } from '../common/constants/Errors';
import { HttpResponseCode } from '../common/constants/HttpResponseCode';
import { TOKENS } from '../containers/Symbols';
import { ILoggerService } from '../logger/logger.service.interface';
import { CreateCategoryBody, CreateCategoryDto, CreateCategoryResponse } from './dto/category.dto';
import { CreateProductDto, productBodyDTO } from './dto/product.dto';
import { IProductController } from './interfaces/product-controller.interface';
import { inputFiles, IProductService } from './interfaces/product-service.interface';
import { IDimensions } from './interfaces/product-schema.interface';

export class ProductController extends BaseController implements IProductController {
  constructor(
    private readonly Logger: ILoggerService,
    private readonly ProductService: IProductService,
  ) {
    super(Logger);

    this.bindRouts([
      <RouteOptions>{
        method: 'POST',
        url: '/product/create-category',
        handler: this.createCategory.bind(this),
        schema: {
          body: CreateCategoryDto,
          response: {
            200: CreateCategoryResponse,
          },
        },
      },
      <RouteOptions>{
        method: 'POST',
        url: '/product/create-product',
        handler: this.createProduct.bind(this),
        schema: {
          body: {
            type: 'object',
            required: ['name', 'description', 'price', 'dimensions', 'category', 'files'],
            properties: {
              name: { type: 'string' },
              description: { type: 'string' },
              price: { type: 'string' },
              dimensions: { type: 'string' },
              category: { type: 'string' },
              files: { type: 'array' },
            },
          },
        },
      },
    ]);

    this.Logger.info('ProductController is initialized.');
  }

  async createCategory(
    req: FastifyRequest<{ Body: CreateCategoryBody }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      if (!req.body.name) {
        return reply
          .send({ status: false, message: productErrors.ERROR_NO_CATEGORY_TO_CREATE })
          .code(HttpResponseCode.NOT_FOUND);
      }

      const category = await this.ProductService.createCategory({ name: req.body.name });

      if (!category) {
        return reply
          .send({ status: false, message: productErrors.ERROR_WHILE_CREATING_CATEGORY })
          .code(HttpResponseCode.NOT_FOUND);
      }

      return reply.send({ status: true, name: category }).code(HttpResponseCode.CREATED);
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(500).send({ status: false, message: error.message });
      }
    }
  }

  async createProduct(
    req: FastifyRequest<{ Body: productBodyDTO }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      if (!req.files) {
        return reply
          .send({ status: false, message: productErrors.ERROR_NO_IMAGES_TO_UPLOAD })
          .code(HttpResponseCode.NOT_FOUND);
      }

      const dimensioins: IDimensions = JSON.parse(req.body.dimensions);

      const product = await this.ProductService.createProduct(
        req.body.name,
        req.body.description,
        Number(req.body.price),
        dimensioins,
        req.body.category,
        req.body.files,
      );

      return reply.send({ status: true, createdProduct: product }).code(HttpResponseCode.CREATED);
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(500).send({ status: false, message: error.message });
      }
    }
  }

  async findAll(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    console.log('hello');
  }

  async findOne(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    console.log('hello');
  }

  async deleteProduct(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    console.log('hello');
  }
}

injected(ProductController, TOKENS.Logger, TOKENS.ProductService);
