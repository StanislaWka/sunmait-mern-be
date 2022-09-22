import { Request, Response } from 'express';
import { HTTP_CODE } from '../../constants';
import postService from './service';

class PostsController {
  async createPost(req: Request, res: Response) {
    try {
      const { title, text, userId, imageUrl, viewsCount, tags = [] } = req.body;

      const result = await postService.createPost({
        title,
        text,
        tags,
        viewsCount,
        userId,
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

  async getOnePost(req: Request, res: Response) {
    try {
      const postId = req.params.id;

      const result = await postService.getOnePost({ postId });

      res.send(result);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async updatePost(req: Request, res: Response) {
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

  async deletePost(req: Request, res: Response) {
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
