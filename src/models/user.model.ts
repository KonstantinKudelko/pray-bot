import { Document, Schema, model, Types } from 'mongoose';

import { Need, NeedSchema } from './need.model';
import { Reminder, ReminderSchema } from './reminder.model';

export interface User extends Document {
  name: string;
  needs: Types.Array<Need>;
  username: string;
  timezone: string;
  createdAt: string;
  reminders: Types.Array<Reminder>;
  totalNeeds: number;
  totalPrayers: number;
  totalAnsweredNeeds: number;
}

export const UserSchema = new Schema(
  {
    _id: String,
    name: String,
    needs: [NeedSchema],
    username: String,
    timezone: String,
    reminders: [ReminderSchema],
    totalNeeds: { type: Number, default: 0 },
    totalPrayers: { type: Number, default: 0 },
    totalAnsweredNeeds: { type: Number, default: 0 },
  },
  { _id: false, timestamps: true },
);

export const UserModel = model<User>('User', UserSchema);
