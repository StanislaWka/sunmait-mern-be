import { Request, Response } from 'express';
import { HTTP_CODE } from '../constants';
import { AuthorizedRequest } from '../interfaces';
import postService from '../services/post';
import { IdParam, PostData } from './interfaces';

class PostsController {
  async createPost(req: AuthorizedRequest<null, null, PostData>, res: Response) {
    try {
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
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getAllPosts(req: Request, res: Response) {
    try {
      const result = await postService.getAllPosts();

      res.send(result);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getOnePost(req: Request<IdParam>, res: Response) {
    try {
      const postId = req.params.id;

      const result = await postService.getOnePost({ postId });

      res.send(result);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async updatePost(req: Request<IdParam, null, PostData>, res: Response) {
    try {
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
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async deletePost(req: Request<IdParam>, res: Response) {
    try {
      const postId = req.params.id;

      const result = await postService.deletePost({ postId });

      res.send(result);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

export default new PostsController();
