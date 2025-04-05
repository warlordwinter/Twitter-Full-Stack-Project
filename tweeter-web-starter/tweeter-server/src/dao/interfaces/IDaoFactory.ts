import { IAuthDao } from './IAuthDao';
import { IUserDao } from './IUserDao';
import { IStatusDao } from './IStatusDao';
import { IFollowDao } from './IFollowDao';
export interface IDaoFactory {
  createAuthDao(): IAuthDao;
  createUserDao(): IUserDao;
  createStatusDao(): IStatusDao;
  createFollowDao(): IFollowDao;
}
