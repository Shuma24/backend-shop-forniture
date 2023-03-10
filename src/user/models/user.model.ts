import { IUser, UserRole } from '../interfaces/user.interface';
import { Schema, model, HydratedDocument } from 'mongoose';

export type userDocument = HydratedDocument<IUser>;

const userSchema = new Schema<IUser>({
  id: { auto: true, type: String },
  name: { type: String },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: UserRole, default: UserRole.User },
  refreshTokens: [
    {
      deviceId: {
        type: String,
        required: true,
      },
      token: {
        type: String,
        required: true,
      },
      tokenDieDate: {
        type: Date,
        required: true,
      },
    },
  ],
});

export const userModel = model<IUser>('User', userSchema);
