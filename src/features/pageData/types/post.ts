
import { FacebookPost } from './index';

export interface PostsTableProps {
  pageId?: string;
  accessToken?: string;
}

export interface PostItemProps {
  post: FacebookPost;
  formatDate: (dateString: string) => string;
  onViewDetails: (post: FacebookPost) => void;
}

export interface PostDetailsDialogProps {
  post: FacebookPost | null;
  formatDate: (dateString: string) => string;
  isOpen: boolean;
  onClose: () => void;
}
