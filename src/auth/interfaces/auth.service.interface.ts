import { Types } from 'mongoose';
import { userDocument } from '../../user/models/user.model';

export interface IAuthService {
  reg: (
    email: string,
    password: string,
    name: string | undefined,
  ) => Promise<userDocument | undefined>;
  validate: (email: string, password: string) => Promise<userDocument | undefined>;
  login: (
    id: Types.ObjectId,
    deviceId: string,
  ) => Promise<
    | {
        accessToken: string;
        refreshToken: string;
      }
    | undefined
  >;

  refresh: (refreshToken: string) => Promise<
    | {
        accessToken: string;
        refreshToken: string;
      }
    | undefined
  >;
}
