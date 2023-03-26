import { Static, Type } from '@sinclair/typebox';

export const CreateProductDto = Type.Object({
  name: Type.String(),
  description: Type.String(),
  price: Type.String(),
  dimensions: Type.Any(),
  category: Type.String(),
  files: Type.Array(Type.Any()),
});

export const ProductResponse = Type.Object({
  status: Type.Boolean(),
  id: Type.String(),
  name: Type.String(),
  description: Type.String(),
  price: Type.Number(),
  dimensions: Type.Object({
    width: Type.Number(),
    height: Type.Number(),
    depth: Type.Number(),
  }),
  category: Type.String(),
  images: Type.Array(
    Type.Object({
      url: Type.String(),
      filename: Type.String(),
      _id: Type.String(),
    }),
  ),
});

export const ProductResponseArray = Type.Object({
  status: Type.Boolean(),
  products: Type.Array(
    Type.Object({
      _id: Type.String(),
      name: Type.String(),
      description: Type.String(),
      price: Type.Number(),
      dimensions: Type.Object({
        width: Type.Number(),
        height: Type.Number(),
        depth: Type.Number(),
      }),
      category: Type.String(),
      images: Type.Array(
        Type.Object({
          url: Type.String(),
          filename: Type.String(),
          _id: Type.String(),
        }),
      ),
    }),
  ),
  lastPage: Type.Number(),
  total: Type.Number(),
  currentPage: Type.Number(),
  limits: Type.Number(),
});

export const findOneParams = Type.Object({
  id: Type.String(),
});

export const findByCategoryIdParams = Type.Object({
  category: Type.String(),
});

export const queryParamsFindCategory = Type.Object({
  page: Type.Optional(Type.String()),
  limit: Type.Optional(Type.String()),
});

export const queryParamsAllProducts = Type.Object({
  page: Type.Optional(Type.String()),
  limit: Type.Optional(Type.String()),
  sortBy: Type.Optional(Type.Enum({ asc: 'asc', desc: 'desc' })),
  getBy: Type.Optional(Type.String()),
  search: Type.Optional(Type.String()),
});

export type productBodyDTO = Static<typeof CreateProductDto>;
export type findOneParamsDto = Static<typeof findOneParams>;
export type findByCategoryByIdParamsDto = Static<typeof findByCategoryIdParams>;
export type queryParamsFindCategoryDto = Static<typeof queryParamsFindCategory>;
export type queryParamsAllProductsDto = Static<typeof queryParamsAllProducts>;
