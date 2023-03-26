import { injected } from 'brandi';
import { IStorage } from '../aws/interfaces/storage.interface';
import { productErrors } from '../common/constants/Errors';
import { TOKENS } from '../containers/Symbols';
import { ILoggerService } from '../logger/logger.service.interface';
import { ICategory } from './interfaces/category-schema.interface';
import { IAWSUploadResponse } from './interfaces/images-aws-upload.interface';
import { IDimensions, IProduct, IProducts } from './interfaces/product-schema.interface';
import { inputFiles, IProductService } from './interfaces/product-service.interface';
import { ProductRepository } from './repository/product.repository';

export class ProductService implements IProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly logger: ILoggerService,
    private readonly s3: IStorage,
  ) {
    this.logger.info('ProductService is initialized.');
  }

  async createCategory(category: ICategory): Promise<string | undefined> {
    try {
      if (!category.name) {
        throw new Error(productErrors.ERROR_WHILE_CREATING_CATEGORY);
      }

      const checkToDuplicate = await this.productRepository.findCategoryByName(category.name);

      if (checkToDuplicate) {
        throw new Error(productErrors.ERROR_CATEGORY_ALREADY_EXISTS);
      }

      const newCategory = await this.productRepository.createCategory(category);

      if (!newCategory) {
        throw new Error(productErrors.ERROR_WHILE_CREATING_CATEGORY);
      }
      await newCategory.save();

      return newCategory.name;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
  async createProduct(
    name: string,
    description: string,
    price: number,
    dimensions: IDimensions,
    category: string,
    files: inputFiles[],
  ): Promise<IProduct | undefined> {
    try {
      const findCategoryByName = await this.productRepository.findCategoryByName(category);

      if (!findCategoryByName) {
        throw new Error(productErrors.ERROR_CATEGORY_NOT_FOUND);
      }

      const uploadImages = async () => {
        const uploadedProductImages: IAWSUploadResponse[] = [];
        for (const file of files) {
          const uploadImage = await this.s3.handleFile(file);
          if (uploadImage) uploadedProductImages.push(uploadImage);
        }

        return uploadedProductImages;
      };

      const images = await uploadImages();

      const newProduct = {
        name: name,
        description: description,
        price: price,
        dimensions: dimensions,
        images: images,
      };

      const categoryId = findCategoryByName._id.toString();

      const productInstance = await this.productRepository.createProduct(newProduct, categoryId);

      return {
        id: productInstance._id.toString(),
        name: productInstance.name,
        description: productInstance.description,
        price: productInstance.price,
        dimensions: productInstance.dimensions,
        images: productInstance.images,
        category: productInstance.category,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
  async findAll(
    page?: string,
    limit?: string,
    search?: string,
    getBy?: string,
    sortBy?: 'asc' | 'desc',
  ): Promise<IProducts | undefined> {
    try {
      const allProducts = await this.productRepository.findAll(
        Number(page),
        Number(limit),
        search,
        getBy,
        sortBy,
      );

      if (!allProducts) throw new Error(productErrors.PRODUCT_NOT_FOUND);

      const productsArray = allProducts.products.map((product) => {
        product.id = product._id.toString();
        return product;
      });

      return {
        products: productsArray,
        lastPage: allProducts.lastPage,
        total: allProducts.total,
        currentPage: allProducts.currentPage,
        limits: allProducts.limits,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
  async findOne(productId: string): Promise<IProduct | undefined> {
    try {
      if (!productId) throw new Error(productErrors.ERROR_PRODUCT_ID_NOT_FOUND);
      const product = await this.productRepository.findOne(productId);

      if (!product) throw new Error(productErrors.PRODUCT_NOT_FOUND);

      return {
        id: product._id.toString(),
        name: product.name,
        description: product.description,
        price: product.price,
        dimensions: product.dimensions,
        images: product.images,
        category: product.category,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async findCategoryById(
    categoryId: string,
    page?: string,
    limit?: string,
  ): Promise<IProducts | undefined> {
    try {
      if (!categoryId) throw new Error(productErrors.ERROR_CATEGORY_NAME_NOT_FOUND);

      const products = await this.productRepository.findProductsByCategory(
        categoryId,
        page ? parseInt(page) : undefined,
        limit ? parseInt(limit) : undefined,
      );

      if (!products) throw new Error(productErrors.PRODUCT_NOT_FOUND);

      const productsArray = products.products.map((product) => {
        product.id = product._id.toString();
        return product;
      });

      return {
        products: productsArray,
        lastPage: products.lastPage,
        total: products.total,
        currentPage: products.currentPage,
        limits: products.limits,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async findAllCategory(): Promise<ICategory[] | undefined> {
    try {
      const categories = await this.productRepository.findAllCategories();

      if (!categories) throw new Error(productErrors.ERROR_CATEGORY_NOT_FOUND);

      return categories;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  deleteProduct(productId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

injected(ProductService, TOKENS.ProductRepository, TOKENS.Logger, TOKENS.BucketStorage);
