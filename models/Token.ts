import { Schema, model } from 'mongoose';

const schema = new Schema({
  refreshToken: { type: String, required: true },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
});

export const Token = model('Token', schema);
