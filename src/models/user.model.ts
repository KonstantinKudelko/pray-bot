import { Document, Schema, model, Types } from 'mongoose';

import { Need, NeedSchema } from './need.model';

export interface User extends Document {
  name: string;
  needs: Types.Array<Need>;
  username: string;
  totalNeeds: number;
}

export const UserSchema = new Schema(
  {
    _id: String,
    name: String,
    needs: [NeedSchema],
    username: String,
    totalNeeds: Number,
  },
  { _id: false, timestamps: true },
);

export const UserModel = model<User>('User', UserSchema);
