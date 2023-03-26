import { ICategory } from '../interfaces/category-schema.interface';
import { IProduct } from '../interfaces/product-schema.interface';
import { Category } from '../models/category.schema';
import { Product } from '../models/product.schema';

export class ProductRepository {
  async createCategory(category: ICategory) {
    const instance = await Category.create({
      name: category.name,
    });

    return await instance.save();
  }

  async createProduct(product: Omit<IProduct, 'category'>, categoryId: string) {
    const instance = await Product.create({
      name: product.name,
      description: product.description,
      price: product.price,
      dimensions: {
        width: product.dimensions.width,
        height: product.dimensions.height,
        depth: product.dimensions.depth,
      },
      images: product.images,
      category: categoryId,
    });

    return await instance.save();
  }

  async findAll(
    page?: number,
    limit?: number,
    search?: string,
    getBy?: string,
    sortBy?: 'asc' | 'desc',
  ) {
    let query = {};

    if (search) {
      query = { name: { $regex: search, $options: 'i' } };
    }

    if (getBy && sortBy) {
      query = { [getBy]: sortBy };
    }

    const currentPage: number = page || 1;

    const limits: number = limit || 4;

    const total = await Product.find(query).count();

    const skipAmount = (currentPage - 1) * limits;

    const products = await Product.find(query).sort(query).skip(skipAmount).limit(limits).exec();

    const lastPage = Math.ceil(total / limits);

    return { products, lastPage, total, currentPage, limits };
  }

  async findOne(productId: string) {
    return await Product.findById(productId).exec();
  }

  async delete(productId: string) {
    return await Product.deleteOne({ _id: productId }).exec();
  }

  async findCategoryByName(name: string) {
    return await Category.findOne({ name: name }).exec();
  }

  async findProductsByCategory(id: string, page?: number, limit?: number) {
    const total: number = await Product.find({ category: id }).count();
    const currentPage: number = page || 1;
    const limits: number = limit || 4;
    const skipAmount = (currentPage - 1) * limits;

    const products = await Product.find({ category: id }).skip(skipAmount).limit(limits).exec();

    const lastPage = Math.ceil(total / limits);

    return { products, lastPage, total, currentPage, limits };
  }

  async findAllCategories() {
    return await Category.find().exec();
  }
}
