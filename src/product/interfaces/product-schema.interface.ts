import { ICategory } from './category-schema.interface';

export interface IDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface IArrayImages {
  url: string;
  filename: string;
}

export interface IProduct {
  id?: string;
  name: string;
  description: string;
  price: number;
  dimensions: IDimensions;
  category: ICategory;
  images: IArrayImages[];
}

export interface IProducts {
  products: IProduct[];
  lastPage: number;
  total: number;
  currentPage: number;
  limits: number;
}
