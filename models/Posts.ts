import { Schema, model } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface PostModel {
  _id: string;
  title: string;
  text: string;
  tags: string[];
  viewsCount: number;
  imageUrl: string;
  user: ObjectId;
}

const PostSchema = new Schema<PostModel>(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      unique: true,
    },
    tags: { type: [ObjectId], ref: 'Tag' },
    viewsCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    imageUrl: String,
  },
  {
    timestamps: true,
  },
);

export const Post = model('Post', PostSchema);
