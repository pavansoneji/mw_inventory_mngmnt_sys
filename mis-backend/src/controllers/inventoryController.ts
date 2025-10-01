import { Request, Response } from 'express';
import { Inventory } from '../models/Inventory';
import { AuthRequest } from '../middleware/auth';
import csv from 'fast-csv';
import fs from 'fs';
import path from 'path';

export const createInventory = async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body;
    data.createdBy = req.user!._id;
    const inventory = new Inventory(data);
    await inventory.save();
    res.status(201).json({ inventory });
  } catch (err) {
    res.status(500).json({ message: 'Create inventory failed', error: err });
  }
};

// Bulk CSV upload
export const uploadCSV = async (req: AuthRequest, res: Response) => {
  if (!req.file) return res.status(400).json({ message: 'CSV file required' });

  const fileRows: any[] = [];
  fs.createReadStream(req.file.path)
    .pipe(csv.parse({ headers: true }))
    .on('error', error => res.status(500).json({ message: 'CSV parse error', error }))
    .on('data', row => {
      row.createdBy = req.user!._id;
      fileRows.push(row);
    })
    .on('end', async () => {
      try {
        await Inventory.insertMany(fileRows);
        if (req.file && req.file.path) {
          fs.unlinkSync(req.file.path);
        }
        res.json({ message: 'CSV uploaded successfully', count: fileRows.length });
      } catch (err) {
        res.status(500).json({ message: 'CSV insert failed', error: err });
      }
    });
};

// Get all inventories (with filters)
export const listInventories = async (req: Request, res: Response) => {
  const filters: any = {};
  const { inventoryType, mediaOwner, country, state, district, inventoryAvailability, minPrice, maxPrice } = req.query;

  if (inventoryType) filters.inventoryType = inventoryType;
  if (mediaOwner) filters['mediaOwner'] = mediaOwner;
  if (country) filters['country.id'] = country;
  if (state) filters['state.id'] = state;
  if (district) filters['district.id'] = district;
  if (inventoryAvailability) filters.inventoryAvailability = inventoryAvailability;
  if (minPrice || maxPrice) filters['inventoryCost.amount'] = { $gte: Number(minPrice) || 0, $lte: Number(maxPrice) || Infinity };

  const inventories = await Inventory.find(filters).populate('mediaOwner');
  res.json({ count: inventories.length, inventories });
};
