import mongoose from 'mongoose';
import { IProduct } from '../interfaces/product-schema.interface';
import { Category } from './category.schema';

const productSchema = new mongoose.Schema<IProduct>({
  id: { auto: true, type: String },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  dimensions: {
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    depth: {
      type: Number,
      required: true,
    },
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Category,
    required: true,
  },
  images: [
    {
      url: {
        type: String,
        required: true,
      },
      filename: {
        type: String,
        required: true,
      },
    },
  ],
});

export const Product = mongoose.model<IProduct>('Product', productSchema);
