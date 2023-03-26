import { Static, Type } from '@sinclair/typebox';

export const CreateCategoryDto = Type.Object({
  name: Type.Optional(Type.String()),
});

export const CreateCategoryResponse = Type.Object({
  status: Type.Boolean(),
  name: Type.String(),
});

export const categoriesResponse = Type.Object({
  status: Type.Boolean(),
  categories: Type.Array(
    Type.Object({
      _id: Type.String(),
      name: Type.String(),
    }),
  ),
});

export type CreateCategoryBody = Static<typeof CreateCategoryDto>;
