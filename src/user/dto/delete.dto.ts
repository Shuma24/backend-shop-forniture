import { Type } from '@sinclair/typebox';

export const deleteUserResponseDTO = Type.Object({
  status: Type.Boolean(),
  success: Type.Boolean(),
});
