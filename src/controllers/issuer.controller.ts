import { Request, Response } from 'express';
import { IssuerModel, Issuer } from '../models/issuer.model';
import mongoose from 'mongoose';

export const handleCreateIssuer = async (req: Request, res: Response): Promise<void> => {
  try {
    // const { IssuerName, businessMail } = req.body;
    const { email,uid } = req.body;

    const newIssuer: Issuer = new IssuerModel({
      businessMail:email,
      firebaseUid:uid
    });

    const createdIssuer = await newIssuer.save();
    res.status(201).json(createdIssuer);
  } catch (error) {
      if (error instanceof mongoose.Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
};

//Read
export const handleGetIssuerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { IssuerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(IssuerId)) {
      res.status(400).json({ error: 'Invalid Issuer ID' });
      return;
    }

    const Issuer = await IssuerModel.findById(IssuerId).exec();

    if (!Issuer) {
      res.status(404).json({ error: 'Issuer not found' });
      return;
    }

    res.json(Issuer);
  } catch (error) {
      if (error instanceof mongoose.Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
};

//Update
export const handleUpdateIssuerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { IssuerId } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(IssuerId)) {
      res.status(400).json({ error: 'Invalid Issuer ID' });
      return;
    }

    const updatedIssuer = await IssuerModel.findByIdAndUpdate(IssuerId, updateData, { new: true }).exec();

    if (!updatedIssuer) {
      res.status(404).json({ error: 'Issuer not found' });
      return;
    }

    res.json(updatedIssuer);
  } catch (error) {
      if (error instanceof mongoose.Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
};

//Delete
export const handleDeleteIssuerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { IssuerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(IssuerId)) {
      res.status(400).json({ error: 'Invalid Issuer ID' });
      return;
    }

    const deletedIssuer = await IssuerModel.findByIdAndDelete(IssuerId).exec();

    if (!deletedIssuer) {
      res.status(404).json({ error: 'Issuer not found' });
      return;
    }

    res.json({ message: 'Issuer deleted successfully' });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
