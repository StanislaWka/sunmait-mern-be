import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { DEFAULT_LIMIT, HTTP_CODE } from '../constants';
import { AuthorizedRequest } from '../interfaces';
import postService from '../services/post';
import { IdParam, PostData } from './interfaces';

class PostsController {
  async createPost(req: AuthorizedRequest<null, null, PostData>, res: Response) {
    const { title, text, imageUrl, viewsCount, tags = [] } = req.body;

    const result = await postService.createPost({
      title,
      text,
      tags,
      viewsCount,
      userId: req.userId,
      imageUrl,
    });

    res.status(HTTP_CODE.CREATED).send(result);
  }

  async getAllPosts(req: Request, res: Response) {
    const { limit = DEFAULT_LIMIT, page = 0, filter = '', tags = '', order = '' } = req.query;
    let tagsArray = (tags as string).split(',');
    let objectIdArray: any = [];
    if (tagsArray[0] === '') {
      tagsArray = [];
    } else {
      objectIdArray = tagsArray.map((tagId) => new ObjectId(tagId));
    }

    const result = await postService.getAllPosts(
      Number(limit),
      Number(page),
      String(filter),
      objectIdArray,
      String(order),
    );

    res.send(result);
  }

  async getOnePost(req: Request<IdParam>, res: Response) {
    const postId = req.params.id;

    const result = await postService.getOnePost({ postId });

    res.send(result);
  }

  async updatePost(req: Request<IdParam, null, PostData>, res: Response) {
    const postId = req.params.id;
    const { title, text, imageUrl, tags = [] } = req.body;
    const result = await postService.updatePost({
      title,
      text,
      imageUrl,
      tags,
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

    const result = await postService.getUserPosts(userId, Number(limit), Number(page));

    res.send(result);
  }
}

export default new PostsController();
