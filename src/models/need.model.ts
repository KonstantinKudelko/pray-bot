import { Document, Schema, model } from 'mongoose';

type NeedStatus = 'active' | 'answered';

export interface Need extends Document {
  _id: string;
  name: string;
  status: NeedStatus;
}

export const NeedSchema = new Schema({
  _id: String,
  name: String,
  status: String,
});

export const NeedModel = model<Need>('Need', NeedSchema);
