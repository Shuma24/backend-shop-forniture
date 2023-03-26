import mongoose from 'mongoose';
import { ICategory } from '../interfaces/category-schema.interface';

const categorySchema = new mongoose.Schema<ICategory>({
  id: { auto: true, type: String },
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

export const Category = mongoose.model<ICategory>('Category', categorySchema);
