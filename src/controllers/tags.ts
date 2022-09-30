import { Request, Response } from 'express';
import { HTTP_CODE } from '../constants';
import tagService from '../services/tags';

interface TagBody {
  name: string;
}

interface IdParam {
  id: string;
}

class TagsController {
  async createTag(req: Request<null, null, TagBody>, res: Response) {
    try {
      const { name } = req.body;

      const result = await tagService.createTag(name);

      res.status(HTTP_CODE.CREATED).send(result);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getAllTags(req: Request, res: Response) {
    try {
      const result = await tagService.getAllTags();

      res.send(result);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async updateTag(req: Request<IdParam, null, TagBody>, res: Response) {
    try {
      const tagId = req.params.id;
      const { name } = req.body;
      await tagService.updateTag(tagId, name);

      res.sendStatus(HTTP_CODE.OK);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async deleteTag(req: Request<IdParam>, res: Response) {
    try {
      const tagId = req.params.id;
      await tagService.deleteTag(tagId);

      res.sendStatus(HTTP_CODE.OK);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

export default new TagsController();
