import mongoose, { Schema, Document } from 'mongoose';

export interface ICertificate extends Document {
  certificateId: string;
  recipientName: string;
  certificateType: string;
  award: string;
  eventName: string;
  description: string;
  eventDate: Date;
  issueDate: Date;
  signatoryIds: mongoose.Types.ObjectId[];
  qrData: string;
  pdfUrl: string;
  status: 'draft' | 'generated' | 'issued' | 'revoked';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const certificateSchema = new Schema<ICertificate>(
  {
    certificateId: { type: String, required: true, unique: true, index: true },
    recipientName: { type: String, required: true, trim: true },
    certificateType: { type: String, required: true },
    award: { type: String, required: true, trim: true },
    eventName: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    eventDate: { type: Date, required: true },
    issueDate: { type: Date, required: true },
    signatoryIds: [{ type: Schema.Types.ObjectId, ref: 'Signatory' }],
    qrData: { type: String, default: '' },
    pdfUrl: { type: String, default: '' },
    status: {
      type: String,
      enum: ['draft', 'generated', 'issued', 'revoked'],
      default: 'draft',
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

certificateSchema.index({ recipientName: 'text', award: 'text', eventName: 'text', certificateId: 'text' });

export default mongoose.model<ICertificate>('Certificate', certificateSchema);
