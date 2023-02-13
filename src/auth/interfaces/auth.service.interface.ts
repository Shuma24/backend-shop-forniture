import { userDocument } from '../../user/models/user.model';

export interface IAuthService {
  reg: (email: string, password: string, name: string | undefined) => Promise<userDocument | null>;
  validate: () => Promise<userDocument>;
  login: () => Promise<userDocument>;
}