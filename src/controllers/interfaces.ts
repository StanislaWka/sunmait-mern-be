import { Request } from 'express';
import { UserModel } from '../../models/User';
import { PostModel } from '../../models/Posts';

export type IdParam = {
  id: string;
};

// I don't change this type because of  some fields can be partial
export interface PostData {
  title: string;
  text: string;
  imageUrl?: string;
  viewsCount?: number;
  tags?: string[];
}

export type PostDataWithUsers = PostModel & {
  userId: string;
  user: Omit<UserModel, 'password' | 'imageUrl'>;
};

export interface GetAllPostQuery {
  limit: string;
  page: string;
  filter: string;
  tagsId?: string;
  order: string;
}

export interface GetAllPostsRequest extends Request<null, null, null, GetAllPostQuery> {}

export interface LoginBody extends Pick<UserModel, 'email' | 'password'> {}

export interface RegistrationBody extends Omit<UserModel, '_id' | 'avatarUrl'> {}
