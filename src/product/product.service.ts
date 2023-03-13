import { injected } from 'brandi';
import { IStorage } from '../aws/interfaces/storage.interface';
import { productErrors } from '../common/constants/Errors';
import { TOKENS } from '../containers/Symbols';
import { ILoggerService } from '../logger/logger.service.interface';
import { ICategory } from './interfaces/category-schema.interface';
import { IAWSUploadResponse } from './interfaces/images-aws-upload.interface';
import { IDimensions, IProduct } from './interfaces/product-schema.interface';
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
  findAll(): Promise<IProduct[]> {
    throw new Error('Method not implemented.');
  }
  findOne(productId: string): Promise<IProduct> {
    throw new Error('Method not implemented.');
  }
  deleteProduct(productId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

injected(ProductService, TOKENS.ProductRepository, TOKENS.Logger, TOKENS.BucketStorage);
