import { Type } from '@sinclair/typebox';

export const ProfileResponseDto = Type.Object({
  status: Type.Boolean(),
  data: Type.Object({
    id: Type.String(),
    name: Type.Optional(Type.String()),
    email: Type.String(),
    role: Type.String(),
  }),
});
