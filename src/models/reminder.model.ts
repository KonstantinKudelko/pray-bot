import { Document, Schema, model } from 'mongoose';

export interface Reminder extends Document {
  _id: string;
  time: string;
}

export const ReminderSchema = new Schema(
  {
    _id: { type: String },
    time: String,
  },
  { _id: false },
);

export const ReminderModel = model<Reminder>('Reminder', ReminderSchema);
