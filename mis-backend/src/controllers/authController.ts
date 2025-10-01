import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: '1h' });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, ownerId } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const user = new User({ name, email, password, role, ownerId });
    await user.save();

    const token = generateToken(user._id.toString());
    res.status(201).json({ user, token });
  } catch (err: any) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id.toString());
    res.json({ user, token });
  } catch (err: any) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
