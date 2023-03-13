import { Static, Type } from '@sinclair/typebox';

export const CreateProductDto = Type.Object({
  name: Type.String(),
  description: Type.String(),
  price: Type.String(),
  dimensions: Type.Any(),
  category: Type.String(),
  files: Type.Array(
    Type.Object({
      type: Type.String(),
      data: Type.Any(),
      filename: Type.String(),
      encoding: Type.String(),
      mimetype: Type.String(),
      limit: Type.Boolean(),
    }),
  ),
});

export const CreateProductResponse = Type.Object({
  status: Type.Boolean(),
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
    }),
  ),
});

export type productBodyDTO = Static<typeof CreateProductDto>;
