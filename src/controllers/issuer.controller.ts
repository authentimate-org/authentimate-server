import { Request, Response } from 'express'
import { IssuerModel, Issuer } from '../models/issuer.model'
import mongoose from 'mongoose'

export const handleCreateIssuer = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { issuerName, email, uid } = req.body;

    const newIssuer: Issuer = new IssuerModel({
      issuerName: issuerName,
      businessMail: email,
      firebaseUid: uid
    });

    const issuer = await IssuerModel.findOne({businessMail: email}).exec();

    if(issuer) {
      return res.json({ message: 'This email is already exist.Please sign in' });
    }

    const createdIssuer = await newIssuer.save();
    return res.status(201).json(createdIssuer);
  } catch (error) {
      if (error instanceof mongoose.Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
};

//Read
export const handleGetIssuerById = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.user || !req.issuerId) {
      return res.status(401).json({ error: 'Unauthorized (user not found)' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.issuerId)) {
      return res.status(400).json({ error: 'Invalid issuer ID' });
    }

    const issuer = await IssuerModel.findById(req.issuerId).exec();

    if (!issuer) {
      return res.status(404).json({ error: 'Issuer not found' });
    }

    return res.json(issuer);
  } catch (error) {
      if (error instanceof mongoose.Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
};

//Update
export const handleUpdateIssuerById = async (req: Request, res: Response): Promise<Response> => {
  const { issuerName } = req.body;

  try {
    if (!req.user || !req.issuerId) {
      return res.status(401).json({ error: 'Unauthorized (user not found)' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.issuerId)) {
      return res.status(400).json({ error: 'Invalid Issuer ID' });
    }

    const updatedIssuer = await IssuerModel.findByIdAndUpdate(
      req.issuerId,
      { issuerName: req.body.issuerName },
      { new: true }
    ).exec();

    if (!updatedIssuer) {
      return res.status(404).json({ error: 'Issuer not found' });
    }

    return res.json(updatedIssuer);
  } catch (error) {
      if (error instanceof mongoose.Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
};

//Delete
export const handleDeleteIssuerById = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.user || !req.issuerId) {
      return res.status(401).json({ error: 'Unauthorized (user not found)' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.issuerId)) {
      return res.status(400).json({ error: 'Invalid Issuer ID' });
    }

    const deletedIssuer = await IssuerModel.findByIdAndDelete(req.issuerId).exec();

    if (!deletedIssuer) {
      return res.status(404).json({ error: 'Issuer not found' });
    }

    return res.json({ message: 'Issuer deleted successfully' });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};
