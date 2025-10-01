import { Schema, model, Document } from 'mongoose';
import { IOwner } from './Owner';

export interface IInventory extends Document {
  referenceId: string;
  name: string;
  inventoryType: 'Digital' | 'Classic' | 'Network' | 'Transit';
  latitude: number;
  longitude: number;
  thumbnailUrl?: string;
  mediaOwner: IOwner;
  country: { id: string; name: string; code: string };
  state: { id: string; name: string; code: string };
  district: { id: string; name: string; code: string };
  inventoryCost: { currency: string; amount: number };
  inventorySpecification: { width: number; height: number; size: string; resolution: string; format: string; orientation: string };
  totalVisitorsByDay: number;
  dailyAverageFrequency: number;
  malePercentage: number;
  femalePercentage: number;
  childPercentage: number;
  youngAdultPercentage: number;
  adultPercentage: number;
  seniorPercentage: number;
  schedule: Array<{ day: string; startTime: string; endTime: string }>;
  inventoryAvailability: 'Available' | 'Limited' | 'SoldOut' | 'NotAvailable';
  audienceData?: any;
  negotiationSummary?: { status: string; inventoryNegoCost: number };
  siteScore?: { score: number; details: any };
  spotsPerLoop?: number;
  totalSpots?: number;
  spotDuration?: number;
  hourlySpots?: number;
  cpm?: { currency: string; amount: number };
  maxSpotsPerHour?: number;
  demographicsPercentage?: Record<string, number>; // e.g., '10_19_percentage', etc.
  createdBy: import('mongoose').Types.ObjectId; // user who uploaded
}

const inventorySchema = new Schema<IInventory>({
  referenceId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  inventoryType: { type: String, enum: ['Digital', 'Classic', 'Network', 'Transit'], required: true },
  latitude: Number,
  longitude: Number,
  thumbnailUrl: String,
  mediaOwner: { type: Schema.Types.ObjectId, ref: 'Owner', required: true },
  country: { id: String, name: String, code: String },
  state: { id: String, name: String, code: String },
  district: { id: String, name: String, code: String },
  inventoryCost: { currency: String, amount: Number },
  inventorySpecification: { width: Number, height: Number, size: String, resolution: String, format: String, orientation: String },
  totalVisitorsByDay: Number,
  dailyAverageFrequency: Number,
  malePercentage: Number,
  femalePercentage: Number,
  childPercentage: Number,
  youngAdultPercentage: Number,
  adultPercentage: Number,
  seniorPercentage: Number,
  schedule: [{ day: String, startTime: String, endTime: String }],
  inventoryAvailability: { type: String, enum: ['Available', 'Limited', 'SoldOut', 'NotAvailable'] },
  audienceData: Schema.Types.Mixed,
  negotiationSummary: { status: String, inventoryNegoCost: Number },
  siteScore: { score: Number, details: Schema.Types.Mixed },
  spotsPerLoop: Number,
  totalSpots: Number,
  spotDuration: Number,
  hourlySpots: Number,
  cpm: { currency: String, amount: Number },
  maxSpotsPerHour: Number,
  demographicsPercentage: Schema.Types.Mixed,
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export const Inventory = model<IInventory>('Inventory', inventorySchema);
