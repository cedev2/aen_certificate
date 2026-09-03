import mongoose, { Schema, Document } from 'mongoose';

export interface IBrandAsset extends Document {
  name: string;
  type: 'logo' | 'signature' | 'seal' | 'other';
  url: string;
  active: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const brandAssetSchema = new Schema<IBrandAsset>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['logo', 'signature', 'seal', 'other'], default: 'logo' },
    url: { type: String, required: true },
    active: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

export default mongoose.model<IBrandAsset>('BrandAsset', brandAssetSchema);
