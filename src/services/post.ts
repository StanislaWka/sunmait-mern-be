import { ObjectId, UpdateResult } from 'mongodb';
import { Post } from '../../models/Posts';
import { User } from '../../models/User';
import { DEFAULT_LIMIT } from '../constants';
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

    const newPost = await Post.aggregate([
      { $match: { _id: post._id } },
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $lookup: { from: 'tags', localField: 'tags', foreignField: '_id', as: 'tags' } },
    ]);

    return newPost;
  }

  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  async getAllPosts(limit: number, page: number, filter: string, tagsId: string[], order: string) {
    const filetQuery = { $regex: new RegExp(filter), $options: 'i' };
    let tagQuery;
    if (tagsId.length) {
      tagQuery = { tags: { $all: tagsId } };
    } else {
      tagQuery = {
        tags: { $nin: [] },
      };
    }

    let orderQuery: any;

    if (order === '' || order === 'newest') {
      orderQuery = { createdAt: -1 };
    } else if (order === 'oldest') {
      orderQuery = { createdAt: 1 };
    } else if (order === 'mostViewed') {
      orderQuery = { viewsCount: -1 };
    }

    return await Post.aggregate([
      {
        $facet: {
          totalCount: [{ $count: 'count' }],
          posts: [
            { $match: { $or: [{ title: filetQuery }, { text: filetQuery }] } },
            { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            { $match: tagQuery },
            { $lookup: { from: 'tags', localField: 'tags', foreignField: '_id', as: 'tags' } },
            { $sort: orderQuery },
            { $skip: page > 0 ? (page - 1) * limit : 0 },
            { $limit: limit },
          ],
        },
      },
    ]);
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

  async updatePost(data: PatchPost): Promise<UpdateResult> {
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

  async getUserPosts(userId: string, limit = DEFAULT_LIMIT, page = 0) {
    const user = await User.findById(userId);
    const posts = await Post.aggregate([
      {
        $facet: {
          posts: [
            { $match: { user: new ObjectId(userId) } },
            { $lookup: { from: 'tags', localField: 'tags', foreignField: '_id', as: 'tags' } },
            { $skip: page > 0 ? (page - 1) * limit : 0 },
            { $limit: limit },
          ],
        },
      },
    ]);

    posts[0].posts.map((post: any) => (post.user = user));
    posts[0].totalCount = [{ count: posts[0].posts.length }];

    return posts;
  }
}

export default new PostsService();
