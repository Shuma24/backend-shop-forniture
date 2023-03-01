import { Static, Type } from '@sinclair/typebox';

export const LoginUserDto = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 }),
});

export const LoginResponseDto = Type.Object({
  status: Type.Boolean(),
  statusCode: Type.Number(),
  accessToken: Type.String(),
});

export type UserLoginBody = Static<typeof LoginUserDto>;
