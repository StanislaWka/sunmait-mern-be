import { ObjectId } from 'mongodb';
import { Schema, model } from 'mongoose';

export interface UserModel {
  _id: ObjectId;
  name: string;
  surname: string;
  email: string;
  password: string;
  avatarUrl: string;
  roleId: ObjectId;
}

const schema = new Schema<UserModel>(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: false },
    password: { type: String, required: true },
    avatarUrl: String,
    roleId: { type: ObjectId, ref: 'Role', required: true },
  },
  {
    timestamps: true,
  },
);

export const User = model('User', schema);
