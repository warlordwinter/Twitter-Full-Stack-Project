import { UserDto } from 'tweeter-shared';

export interface IUserDao {
  // Basic CRUD operations
  createFollow(follower: UserDto, followee: UserDto): Promise<void>;
  deleteFollow(follower: UserDto, followee: UserDto): Promise<void>;
  getFollow(follower: UserDto, followee: UserDto): Promise<boolean>;
  updateFollowerCount(user: UserDto, increment: number): Promise<void>;
  updateFolloweeCount(user: UserDto, increment: number): Promise<void>;
  getFollowerCount(user: UserDto): Promise<number>;
  getFolloweeCount(user: UserDto): Promise<number>;
  getUser(alias: string): Promise<UserDto | null>;
}
