import { Tag } from '../../models/Tags';
import randomColor from 'randomcolor';
import { createError } from '../utils/errors';
import { Post } from '../../models/Posts';
import { ObjectId } from 'mongodb';

class TagsService {
  async createTag(name: string) {
    const sameTag = await Tag.findOne({ name }).lean();
    if (sameTag) {
      throw new createError.UnprocessableEntity({ data: { message: 'this tag is already used' } });
    }
    const color = randomColor({ luminosity: 'dark' });

    const newTag = new Tag({ name, color });

    await newTag.save();

    return newTag.toObject();
  }

  async getAllTags() {
    return await Tag.find().lean();
  }

  async updateTag(tagId: string, name: string) {
    return await Tag.findOneAndUpdate(
      { _id: tagId },
      { name },
      { returnDocument: 'after', lean: true },
    );
  }

  async deleteTag(tagId: string) {
    await Post.updateMany({ tags: new ObjectId(tagId) }, { $pull: { tags: new ObjectId(tagId) } });
    await Tag.findOneAndDelete({ _id: tagId }).lean();
  }
}

export default new TagsService();
