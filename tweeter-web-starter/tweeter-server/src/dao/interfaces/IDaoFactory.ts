import { IAuthDao } from './IAuthDao';

export interface IDaoFactory {
  createAuthDao(): IAuthDao;
}
