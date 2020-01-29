import { Document, Schema, model } from 'mongoose';

type NeedStatus = 'active' | 'answered';

export interface Need extends Document {
  _id: string;
  name: { iv: string; key: string; encryptedData: string };
  status: NeedStatus;
  answer: string;
}

export const NeedSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  name: Object,
  status: String,
  answer: String,
});

export const NeedModel = model<Need>('Need', NeedSchema);
