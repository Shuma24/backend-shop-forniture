import { Type } from '@sinclair/typebox';

export const LogoutResponseDto = Type.Object({
  status: Type.Boolean(),
  statusCode: Type.Number(),
});
