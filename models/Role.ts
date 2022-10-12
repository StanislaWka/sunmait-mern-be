import { Schema, model, ObjectId } from 'mongoose';

export interface RoleModel {
  _id: ObjectId;
  name: string;
}

const schema = new Schema<RoleModel>({
  name: { type: String, required: true },
});

export const Role = model('Role', schema);
