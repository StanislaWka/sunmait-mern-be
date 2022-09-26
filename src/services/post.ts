import { Post } from '../../models/Posts';
import { PostData } from '../controllers/interfaces';
import { createError } from '../utils/errors';

interface PatchPost extends Omit<Partial<PostData>, 'userId' | 'viewsCount'> {
  postId: string;
}

interface CreatePostData extends PostData {
  userId: string;
}

class PostsService {
  async createPost(data: CreatePostData) {
    const samePost = await Post.findOne({ text: data.text }).lean();

    if (samePost) {
      throw new createError.UnprocessableEntity();
    }

    const { userId, ...otherDate } = data;

    const post = new Post({ ...otherDate, user: userId });

    await post.save();

    return post.toObject();
  }

  async getAllPosts() {
    return await Post.find().populate('user', 'name surname').lean();
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
        lean: true,
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

    const updatedPost = await Post.updateOne(
      {
        _id: postId,
      },
      {
        ...otherData,
      },
    ).lean();

    return updatedPost;
  }

  async deletePost(data: { postId: string }) {
    await Post.findOneAndDelete({
      _id: data.postId,
    }).lean();
  }
}

export default new PostsService();
