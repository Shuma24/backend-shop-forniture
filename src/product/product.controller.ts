import { injected } from 'brandi';
import { FastifyRequest, FastifyReply, RouteOptions } from 'fastify';

import { BaseController } from '../common/abstract-class/base.controller';
import { productErrors } from '../common/constants/Errors';
import { HttpResponseCode } from '../common/constants/HttpResponseCode';
import { TOKENS } from '../containers/Symbols';
import { ILoggerService } from '../logger/logger.service.interface';
import {
  categoriesResponse,
  CreateCategoryBody,
  CreateCategoryDto,
  CreateCategoryResponse,
} from './dto/category.dto';
import {
  CreateProductDto,
  ProductResponse,
  productBodyDTO,
  findOneParams,
  findOneParamsDto,
  findByCategoryIdParams,
  findByCategoryByIdParamsDto,
  ProductResponseArray,
  queryParamsFindCategory,
  queryParamsFindCategoryDto,
  queryParamsAllProducts,
  queryParamsAllProductsDto,
} from './dto/product.dto';
import { IProductController } from './interfaces/product-controller.interface';
import { IProductService } from './interfaces/product-service.interface';
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
          body: CreateProductDto,
          response: {
            200: ProductResponse,
          },
        },
      },
      <RouteOptions>{
        method: 'GET',
        url: '/product/:id',
        handler: this.findOne.bind(this),
        schema: {
          params: findOneParams,
          response: {
            200: ProductResponse,
          },
        },
      },
      <RouteOptions>{
        method: 'GET',
        url: '/product/category/:category',
        handler: this.findProductsByCategory.bind(this),
        schema: {
          querystring: queryParamsFindCategory,
          params: findByCategoryIdParams,
          response: {
            200: ProductResponseArray,
          },
        },
      },
      <RouteOptions>{
        method: 'GET',
        url: '/product/all',
        handler: this.findAll.bind(this),
        schema: {
          querystring: queryParamsAllProducts,
          response: {
            200: ProductResponseArray,
          },
        },
      },
      <RouteOptions>{
        method: 'GET',
        url: '/product/all-category',
        handler: this.findAllCategory.bind(this),
        schema: {
          response: {
            200: categoriesResponse,
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

      return reply.send({ status: true, ...product }).code(HttpResponseCode.CREATED);
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(500).send({ status: false, message: error.message });
      }
    }
  }

  async findAll(
    req: FastifyRequest<{ Querystring: queryParamsAllProductsDto }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const asc = req.query.sortBy === 'asc' ? 'asc' : undefined;
      const desc = req.query.sortBy === 'desc' ? 'desc' : undefined;

      const products = await this.ProductService.findAll(
        req.query.page,
        req.query.limit,
        req.query.search,
        req.query.getBy,
        asc || desc,
      );

      return reply.send({ status: true, ...products }).code(HttpResponseCode.OK);
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(500).send({ status: false, message: error.message });
      }
    }
  }

  async findOne(req: FastifyRequest<{ Params: findOneParamsDto }>, reply: FastifyReply) {
    try {
      if (!req.params.id) {
        return reply
          .send({ status: false, message: productErrors.ERROR_PRODUCT_ID_NOT_FOUND })
          .code(HttpResponseCode.NOT_FOUND);
      }
      const product = await this.ProductService.findOne(req.params.id);

      return reply.send({ status: true, ...product }).code(HttpResponseCode.OK);
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(500).send({ status: false, message: error.message });
      }
    }
  }

  async findProductsByCategory(
    req: FastifyRequest<{
      Params: findByCategoryByIdParamsDto;
      Querystring: queryParamsFindCategoryDto;
    }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      if (!req.params.category) throw new Error(productErrors.ERROR_CATEGORY_NAME_NOT_FOUND);

      const products = await this.ProductService.findCategoryById(
        req.params.category,
        req.query.page,
        req.query.limit,
      );

      if (!products) throw new Error(productErrors.ERROR_CATEGORY_NOT_FOUND);

      return reply.send({ status: true, ...products }).code(HttpResponseCode.OK);
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(500).send({ status: false, message: error.message });
      }
    }
  }

  async findAllCategory(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const categories = await this.ProductService.findAllCategory();

      return reply.send({ status: true, categories }).code(HttpResponseCode.OK);
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(500).send({ status: false, message: error.message });
      }
    }
  }

  async deleteProduct(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    console.log('hello');
  }
}

injected(ProductController, TOKENS.Logger, TOKENS.ProductService);
