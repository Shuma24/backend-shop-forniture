import { Static, Type } from '@sinclair/typebox';

export const RegistrationUserDto = Type.Object({
  name: Type.Optional(Type.String()),
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 }),
});

export type UserRegistrationBody = Static<typeof RegistrationUserDto>;
