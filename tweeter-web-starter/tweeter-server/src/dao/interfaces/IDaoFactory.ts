import { IAuthDao } from './IAuthDao';
import { IUserDao } from './IUserDao';

export interface IDaoFactory {
  createAuthDao(): IAuthDao;
  createFollowDao(): IUserDao;
}
