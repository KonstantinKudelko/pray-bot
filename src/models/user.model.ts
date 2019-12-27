import { Document, Schema, model } from 'mongoose';

import { Need, NeedSchema } from './need.model';

export interface User extends Document {
  _id: string;
  name: string;
  needs: Need[];
  username: string;
  totalNeeds: number;
}

export const UserSchema = new Schema(
  {
    _id: String,
    name: String,
    number: [NeedSchema],
    username: String,
    totalNeeds: Number,
  },
  { _id: false, timestamps: true },
);

export const UserModel = model<User>('User', UserSchema);
