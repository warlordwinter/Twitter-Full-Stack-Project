import { AuthToken, Status, User } from 'tweeter-shared';
import { StatusService } from '../../model/service/StatusService';

export interface PostStatusView {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, duration: number) => void;
  clearLastInfoMessage: () => void;
  setPost: React.Dispatch<React.SetStateAction<string>>;
  post: string;
  authToken: AuthToken | null;
  currentUser: User | null;
}

export class PostStatusPresenter {
  public view: PostStatusView;
  public postStatusService: StatusService;

  constructor(view: PostStatusView) {
    this.view = view;
    this.postStatusService = new StatusService();
  }
  public submitPost = async (event: React.MouseEvent) => {
    event.preventDefault();

    try {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage('Posting status...', 0);

      const status = new Status(
        this.view.post,
        this.view.currentUser!,
        Date.now()
      );

      await this.postStatusService.postStatus(this.view.authToken!, status);

      this.view.setPost('');
      this.view.displayInfoMessage('Status posted!', 2000);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`
      );
    } finally {
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }
  };
  public clearPost = (event: React.MouseEvent) => {
    event.preventDefault();
    this.view.setPost('');
  };

  public checkButtonStatus: () => boolean = () => {
    return (
      !this.view.post.trim() || !this.view.authToken || !this.view.currentUser
    );
  };
}
