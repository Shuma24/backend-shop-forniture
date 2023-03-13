import { ICategory } from './category-schema.interface';
import { IDimensions, IProduct } from './product-schema.interface';

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
  findAll(): Promise<IProduct[]>;
  findOne(productId: string): Promise<IProduct>;
  deleteProduct(productId: string): Promise<void>;
}
