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

  async findAll() {
    return await Product.find().exec();
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
}
