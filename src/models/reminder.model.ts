import { Document, Schema, model } from 'mongoose';

export interface Reminder extends Document {
  _id: string;
  time: string;
  timezone: string;
}

export const ReminderSchema = new Schema(
  {
    _id: { type: String },
    time: String,
    timezone: String,
  },
  { _id: false },
);

export const ReminderModel = model<Reminder>('Reminder', ReminderSchema);
