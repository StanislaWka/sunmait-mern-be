import { Schema, model } from 'mongoose';

export interface UserModel {
  _id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  avatarUrl: string;
}

const schema = new Schema<UserModel>(
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
