import { Type } from '@sinclair/typebox';

export const errorDTO = Type.Object({
  status: Type.Optional(Type.Boolean()),
  error: Type.String(),
});
