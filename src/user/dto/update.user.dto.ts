import { Static, Type } from '@sinclair/typebox';

export const updateUserDTO = Type.Object({
  name: Type.Optional(Type.String()),
  email: Type.Optional(Type.String({ format: 'email' })),
  password: Type.Optional(Type.String({ minLength: 6 })),
});

export const updateResponseDTO = Type.Object({
  status: Type.Boolean(),
  success: Type.Boolean(),
});

export type updateUserBodyDTO = Static<typeof updateUserDTO>;
