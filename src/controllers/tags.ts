import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
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
    const { name } = req.body;

    const result = await tagService.createTag(name);

    res.status(HTTP_CODE.CREATED).send(result);
  }

  async getAllTags(req: Request, res: Response) {
    const result = await tagService.getAllTags();

    res.send(result);
  }

  async updateTag(req: Request<IdParam, null, TagBody>, res: Response) {
    try {
      const tagId = req.params.id;
      const { name } = req.body;
      await tagService.updateTag(new ObjectId(tagId), name);

      res.sendStatus(HTTP_CODE.OK);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async deleteTag(req: Request<IdParam>, res: Response) {
    const tagId = req.params.id;
    await tagService.deleteTag(new ObjectId(tagId));

    res.sendStatus(HTTP_CODE.OK);
  }
}

export default new TagsController();
