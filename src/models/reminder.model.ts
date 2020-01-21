import { Document, Schema, model } from 'mongoose';

export interface Reminder extends Document {
  cron: string;
}

export const ReminderSchema = new Schema({
  _id: String,
  cron: String,
});

export const ReminderModel = model<Reminder>('Reminder', ReminderSchema);
