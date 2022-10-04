import { ObjectId, UpdateResult } from 'mongodb';
import { Post } from '../../models/Posts';
import { User } from '../../models/User';
import { DEFAULT_LIMIT, ORDER } from '../constants';
import { PostData } from '../controllers/interfaces';
import { createError } from '../utils/errors';

interface PatchPost extends Omit<Partial<PostData>, 'userId' | 'viewsCount'> {
  postId: ObjectId;
  tagsId: ObjectId[];
}

interface CreatePostData extends PostData {
  userId: ObjectId;
  tagsId: ObjectId[];
}

class PostsService {
  async createPost(data: CreatePostData) {
    try {
      const samePost = await Post.findOne({ text: data.text }).lean();

      if (samePost) {
        throw new createError.UnprocessableEntity();
      }

      const { userId, tagsId, ...otherDate } = data;

      const post = new Post({ ...otherDate, tags: tagsId, user: userId });

      await post.save();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  async getAllPosts(
    limit: number,
    page: number,
    filter: string,
    order: string,
    tagsId?: ObjectId[],
  ) {
    try {
      const filetQuery = { $regex: new RegExp(filter), $options: 'i' };
      let orderQuery: any;

      if (order === ORDER.OLDEST) {
        orderQuery = { createdAt: 1 };
      } else if (order === ORDER.MOST_VIEWED) {
        orderQuery = { viewsCount: -1 };
      } else {
        orderQuery = { createdAt: -1 };
      }

      return await Post.aggregate([
        {
          $match: {
            $and: [
              { ...(tagsId?.length && { tags: { $all: tagsId } }) },
              { $or: [{ title: filetQuery }, { text: filetQuery }] },
            ],
          },
        },
        {
          $facet: {
            totalCount: [{ $count: 'count' }],
            posts: [
              { $sort: orderQuery },
              { $skip: page > 0 ? (page - 1) * limit : 0 },
              { $limit: limit },
              { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
              { $unwind: '$user' },
              { $lookup: { from: 'tags', localField: 'tags', foreignField: '_id', as: 'tags' } },
            ],
          },
        },
      ]);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getOnePost(data: { postId: ObjectId }) {
    try {
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
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async updatePost(data: PatchPost): Promise<UpdateResult> {
    try {
      const { postId, ...otherData } = data;
      const post = await Post.findById(postId).lean();
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
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async deletePost(data: { postId: string }) {
    try {
      await Post.findOneAndDelete({
        _id: data.postId,
      }).lean();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getUserPosts(userId: ObjectId, limit = DEFAULT_LIMIT, page = 0) {
    try {
      const user = await User.findById(userId).lean();
      const posts = await Post.aggregate([
        {
          $facet: {
            posts: [
              { $match: { user: userId } },
              { $skip: page > 0 ? (page - 1) * limit : 0 },
              { $limit: limit },
              { $lookup: { from: 'tags', localField: 'tags', foreignField: '_id', as: 'tags' } },
            ],
          },
        },
      ]);

      posts[0].posts.map((post: any) => (post.user = user));
      posts[0].totalCount = [{ count: posts[0].posts.length }];

      return posts;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

export default new PostsService();
