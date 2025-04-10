import { UserDto } from 'tweeter-shared';

export interface IUserDao {
  getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean>;

  getFolloweeCount(user: UserDto): Promise<number>;

  getFollowerCount(user: UserDto): Promise<number>;

  unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]>;

  follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]>;

  getUser(token: string, alias: string): Promise<UserDto | null>;
}
