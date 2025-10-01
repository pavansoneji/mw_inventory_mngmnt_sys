import { Schema, model, Document } from 'mongoose';

export interface ICompany {
  name: string;
  companyType: 'media_owner' | 'aggregator';
}

export interface IOwner extends Document {
  company: ICompany;
  createdBy?: string; // optional link to admin user
}

const ownerSchema = new Schema<IOwner>({
  company: {
    name: { type: String, required: true },
    companyType: { type: String, enum: ['media_owner', 'aggregator'], required: true },
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export const Owner = model<IOwner>('Owner', ownerSchema);
