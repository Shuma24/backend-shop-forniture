import { Static, Type } from '@sinclair/typebox';

export const RegistrationUserDto = Type.Object({
  name: Type.Optional(Type.String()),
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 }),
});

export const RegistrationResponse = Type.Object({
  email: Type.String({ format: 'email' }),
  status: Type.Boolean(),
  statusCode: Type.Number(),
});

export type UserRegistrationBody = Static<typeof RegistrationUserDto>;
