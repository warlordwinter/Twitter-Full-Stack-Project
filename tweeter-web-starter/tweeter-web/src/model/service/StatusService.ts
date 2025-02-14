import { AuthToken, FakeData, Status } from "tweeter-shared";

export class StatusService {
    public async loadMoreFeed(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
    }

    public async loadMoreStory(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
    }
    
}
