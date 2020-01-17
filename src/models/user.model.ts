import { Document, Schema, model, Types } from 'mongoose';

import { Need, NeedSchema } from './need.model';

export interface User extends Document {
  name: string;
  cron: string;
  needs: Types.Array<Need>;
  username: string;
  timezone: string;
  createdAt: string;
  totalNeeds: number;
  totalPrayers: number;
  totalAnsweredNeeds: number;
}

export const UserSchema = new Schema(
  {
    _id: String,
    name: String,
    cron: { type: String, default: '' },
    needs: [NeedSchema],
    username: String,
    timezone: String,
    totalNeeds: { type: Number, default: 0 },
    totalPrayers: { type: Number, default: 0 },
    totalAnsweredNeeds: { type: Number, default: 0 },
  },
  { _id: false, timestamps: true },
);

export const UserModel = model<User>('User', UserSchema);
