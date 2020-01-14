import { Document, Schema, model, Types } from 'mongoose';

import { Need, NeedSchema } from './need.model';

export interface User extends Document {
  name: string;
  needs: Types.Array<Need>;
  username: string;
  timezone: string;
  totalNeeds: number;
  totalPrayers: number;
  timeForReminder: string;
  totalAnsweredNeeds: number;
}

export const UserSchema = new Schema(
  {
    _id: String,
    name: String,
    needs: [NeedSchema],
    username: String,
    timezone: String,
    totalNeeds: { type: Number, default: 0 },
    totalPrayers: { type: Number, default: 0 },
    timeForReminder: String,
    totalAnsweredNeeds: { type: Number, default: 0 },
  },
  { _id: false, timestamps: true },
);

export const UserModel = model<User>('User', UserSchema);
