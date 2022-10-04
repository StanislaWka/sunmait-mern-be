import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { DEFAULT_LIMIT, HTTP_CODE } from '../constants';
import { AuthorizedRequest } from '../interfaces';
import postService from '../services/post';
import { GetAllPostsRequest, IdParam, PostData } from './interfaces';

class PostsController {
  async createPost(req: AuthorizedRequest<null, null, PostData>, res: Response) {
    const { title, text, imageUrl, viewsCount, tags = [] } = req.body;

    const result = await postService.createPost({
      title,
      text,
      tagsId: tags.map((tag) => new ObjectId(tag)),
      viewsCount,
      userId: new ObjectId(req.userId),
      imageUrl,
    });

    res.status(HTTP_CODE.CREATED).send(result);
  }

  async getAllPosts(req: GetAllPostsRequest, res: Response) {
    try {
      const { limit = DEFAULT_LIMIT, page = 0, filter = '', tagsId, order = '' } = req.query;

      const result = await postService.getAllPosts(
        +limit,
        +page,
        filter,
        order,
        tagsId?.split(',').map((tag) => new ObjectId(tag)),
      );

      res.send(result);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getOnePost(req: Request<IdParam>, res: Response) {
    const postId = new ObjectId(req.params.id);

    const result = await postService.getOnePost({ postId });

    res.send(result);
  }

  async updatePost(req: Request<IdParam, null, PostData>, res: Response) {
    const postId = new ObjectId(req.params.id);
    const { title, text, imageUrl, tags = [] } = req.body;
    const result = await postService.updatePost({
      title,
      text,
      imageUrl,
      tagsId: tags.map((tag) => new ObjectId(tag)),
      postId,
    });

    res.send(result);
  }

  async deletePost(req: Request<IdParam>, res: Response) {
    const postId = req.params.id;

    const result = await postService.deletePost({ postId });

    res.send(result);
  }

  async getUserPosts(req: AuthorizedRequest, res: Response) {
    const userId = req.userId;
    const { limit = 100, page = 1 } = req.query;

    const result = await postService.getUserPosts(
      new ObjectId(userId),
      Number(limit),
      Number(page),
    );

    res.send(result);
  }
}

export default new PostsController();
