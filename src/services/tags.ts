import { Tag } from '../../models/Tags';
import randomColor from 'randomcolor';
import { createError } from '../utils/errors';
import { Post } from '../../models/Posts';
import { ObjectId } from 'mongodb';
import { startSession } from 'mongoose';

class TagsService {
  async createTag(name: string) {
    try {
      const sameTag = await Tag.findOne({ name }).lean();
      if (sameTag) {
        throw new createError.UnprocessableEntity({
          data: { message: 'this tag is already used' },
        });
      }
      const color = randomColor({ luminosity: 'dark' });

      const newTag = new Tag({ name, color });

      await newTag.save();

      return newTag.toObject();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getAllTags() {
    try {
      return await Tag.find().lean();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async updateTag(tagId: string, name: string) {
    try {
      return await Tag.findOneAndUpdate(
        { _id: tagId },
        { name },
        { returnDocument: 'after', lean: true },
      );
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async deleteTag(tagId: string) {
    const session = await startSession();
    try {
      session.startTransaction();
      await Post.updateMany(
        { tags: new ObjectId(tagId) },
        { $pull: { tags: new ObjectId(tagId) } },
        { session },
      );
      await Tag.findOneAndDelete({ _id: tagId }, { session }).lean();
    } catch (err) {
      console.error(err);
      session.abortTransaction();
      throw err;
    }
  }
}

export default new TagsService();
