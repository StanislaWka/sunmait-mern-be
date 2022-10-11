import { Schema, model } from 'mongoose';

export interface TagModel {
  name: string;
  color: string;
}

const schema = new Schema<TagModel>({
  name: { type: String, required: true },
  color: { type: String, required: true },
});

export const Tag = model('Tag', schema);
