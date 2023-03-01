import { Types } from 'mongoose';
import { IUser } from '../interfaces/user.interface';
import { userModel } from '../models/user.model';

export class UserRepository {
  async createUser(user: IUser) {
    const instance = await userModel.create({
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role,
    });
    return await instance.save();
  }

  async findUserByEmail(email: string) {
    const user = await userModel.findOne({ email: email }).exec();
    return user;
  }

  async findUserById(id: string) {
    return await userModel.findById(id).exec();
  }

  async deleteUser(id: string) {
    return await userModel.deleteOne({ id: id }).exec();
  }

  async setToken(id: Types.ObjectId, token: string, deviceId: string) {
    return await userModel.updateOne(
      { _id: id },
      {
        $addToSet: {
          refreshTokens: {
            token: token,
            deviceId: deviceId,
            tokenDieDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
          },
        },
      },
    );
  }

  async findUserByToken(refreshToken: string) {
    return await userModel
      .findOne({ refreshTokens: { $elemMatch: { token: refreshToken } } })
      .exec();
  }
}
