import { CallbackError, Document } from 'mongoose';
import { Post } from '../../../models/Posts';
import { createError } from '../../utils/errors';

interface PostData {
  title: string;
  text: string;
  tags: string[];
  viewsCount: number;
  userId: string;
  imageUrl: string;
}

interface PatchPost extends Omit<Partial<PostData>, 'userId' | 'viewsCount'> {
  postId: string;
}

class PostsService {
  async createPost(data: PostData) {
    const samePost = await Post.findOne({ text: data.text });

    if (samePost) {
      throw new createError.UnprocessableEntity();
    }

    const { userId, ...otherDate } = data;

    const post = new Post({ ...otherDate, user: userId });

    await post.save();

    return { message: 'Post have been created' };
  }

  async getAllPosts() {
    const posts = await Post.find().populate('user').exec();

    return posts;
  }

  async getOnePost(data: { postId: string }) {
    const { postId } = data;

    const post = await Post.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
    );

    return post;
  }

  async updatePost(data: PatchPost) {
    const { postId, ...otherData } = data;
    const post = await Post.findById(postId);
    if (!post) {
      throw new createError.UnprocessableEntity();
    }

    await Post.updateOne(
      {
        _id: postId,
      },
      {
        ...otherData,
      },
    );

    return { message: 'Post was updated successfully' };
  }

  async deletePost(data: { postId: string }) {
    Post.findOneAndDelete(
      {
        _id: data.postId,
      },
      (err: CallbackError, doc: Document<unknown>) => {
        if (err) {
          console.error(err);
          throw new createError.InternalServerError();
        }
        if (!doc) {
          throw new createError.NotFound();
        }
      },
    );

    return { message: 'Post was successfully deleted' };
  }
}

export default new PostsService();
