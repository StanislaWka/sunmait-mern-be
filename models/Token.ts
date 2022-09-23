import { Schema, model } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface TokenModel {
  refreshToken: string;
  user: ObjectId;
}

const schema = new Schema<TokenModel>({
  refreshToken: { type: String, required: true },
  user: {
    type: ObjectId,
    ref: 'User',
    require: true,
  },
});

export const Token = model('Token', schema);
