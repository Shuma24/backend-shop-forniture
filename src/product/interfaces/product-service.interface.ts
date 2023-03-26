import { ICategory } from './category-schema.interface';
import { IDimensions, IProduct, IProducts } from './product-schema.interface';

//need fix
export interface inputFiles {
  data: Buffer;
  filename: string;
  encoding: string;
  mimetype: string;
  limit: boolean;
}

export interface IProductService {
  createCategory(category: ICategory): Promise<string | undefined>;
  createProduct(
    name: string,
    description: string,
    price: number,
    dimensions: IDimensions,
    category: string,
    files: inputFiles[],
  ): Promise<IProduct | undefined>;
  findAll(
    page?: string,
    limit?: string,
    search?: string,
    getBy?: string,
    sortBy?: 'asc' | 'desc',
  ): Promise<IProducts | undefined>;
  findOne(productId: string): Promise<IProduct | undefined>;
  deleteProduct(productId: string): Promise<void>;
  findCategoryById(
    categoryName: string,
    page?: string,
    limit?: string,
  ): Promise<IProducts | undefined>;
  findAllCategory(): Promise<ICategory[] | undefined>;
}
