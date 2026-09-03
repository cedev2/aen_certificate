import mongoose, { Schema, Document } from 'mongoose';

export interface ISignatory extends Document {
  name: string;
  title: string;
  signatureUrl: string;
  active: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const signatorySchema = new Schema<ISignatory>(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    signatureUrl: { type: String, default: '' },
    active: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

export default mongoose.model<ISignatory>('Signatory', signatorySchema);
