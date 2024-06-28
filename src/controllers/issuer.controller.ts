import { Request, Response } from 'express'
import mongoose from 'mongoose'
import admin from 'firebase-admin';
import { IssuerModel, Issuer } from '../models/issuer.model'


//create
export const handleCreateIssuer = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized (user not found)' });
    }

    if (req.issuerId) {
      return res.status(401).json({ error: 'Issuer already exists' });
    }

    const newIssuer: Issuer = new IssuerModel({
      businessMail: req.user.email,
      firebaseUid: req.user.uid
    });

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
      { 
        issuerName: issuerName
      },
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

//Check Onboarding Status
export const handleCkeckOnboardingStatus = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.user || !req.issuerId) {
      return res.status(401).json({ error: 'Unauthorized (user not found)' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.issuerId)) {
      return res.status(400).json({ error: 'Invalid Issuer ID' });
    }

    const issuer = await IssuerModel.findById(req.issuerId).exec();

    if (!issuer) {
      return res.status(404).json({ error: 'Issuer not found' });
    }

    return res.json({ status: issuer.onboarding });
  } catch (error) {
      if (error instanceof mongoose.Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
};

//Onboarding
export const handleDoOnboarding = async (req: Request, res: Response): Promise<Response> => {
  const { category, companyName, CIN, instituteName, issuerName, designation, address } = req.body;

  try {
    if (!req.user || !req.issuerId) {
      return res.status(401).json({ error: 'Unauthorized (user not found)' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.issuerId)) {
      return res.status(400).json({ error: 'Invalid Issuer ID' });
    }

    if (!(category && ((companyName && CIN) ^ instituteName ^ issuerName) && designation && address)) {
      return res.send('All fields are required');
    }

    const updatedIssuer = await IssuerModel.findByIdAndUpdate(
      req.issuerId,
      { 
        onboarding: true,
        category: category,
        companyName: companyName,
        CIN: CIN,
        instituteName: instituteName,
        issuerName: issuerName,
        designation: designation,
        address: address
      },
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

    await admin.auth().deleteUser(req.user.uid);

    return res.json({ message: 'Issuer deleted successfully' });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};
