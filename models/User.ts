import { Schema, model } from 'mongoose';

const schema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: false },
    password: { type: String, required: true },
    avatarUrl: String,
  },
  {
    timestamps: true,
  },
);

export const User = model('User', schema);
