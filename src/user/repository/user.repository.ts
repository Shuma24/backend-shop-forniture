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
    const user = await userModel.find({ email: email }).exec();
    return user;
  }

  async findUserById(id: string) {
    return await userModel.findById(id).exec();
  }

  async deleteUser(id: string) {
    return await userModel.deleteOne({ id: id }).exec();
  }
}
