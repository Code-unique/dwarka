// src/models/CustomizationRequest.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomizationRequest extends Document {
  productId: string;
  userId: string;
  size: string;
  color: string;
  notes: string;
  status: 'pending' | 'replied';
  adminReply?: string;
  createdAt: Date;
}

const customizationRequestSchema = new Schema<ICustomizationRequest>(
  {
    productId: { type: String, required: true },
    userId: { type: String, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    notes: { type: String },
    status: { type: String, enum: ['pending', 'replied'], default: 'pending' },
    adminReply: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.CustomizationRequest ||
  mongoose.model<ICustomizationRequest>('CustomizationRequest', customizationRequestSchema);
