import { Request, Response } from 'express';
import { modifiedTemplate, modifiedTemplateModel } from '../models/modifiedTemplate.model';
import { recipientModel, recipient } from '../models/recipient.model';
import { certificationModel, certification } from '../models/certification.model';
import mongoose from 'mongoose';

//Create
export const handleCreateRecipient = async ( req: Request, res: Response, certificationId: mongoose.Schema.Types.ObjectId | unknown, recipient: object ): Promise<void> => {
  try {
    const { projectId }  = req.body;
    const newRecipient: recipient = new recipientModel(recipient);

    const createdRecipient = new recipientModel(newRecipient);
    await createdRecipient.save();

    await certificationModel.findByIdAndUpdate(certificationId, { recipientId: createdRecipient._id }, { new: true }).exec();

    await recipientModel.findByIdAndUpdate(createdRecipient._id, { $push: { achievedCertifications: certificationId } }, { new: true }).exec();

    // res.json({ message: 'Recipient created successfully' });
  } 
  catch (error) {
      // if (error instanceof mongoose.Error) {
      //   res.status(400).json({ error: error.message });
      // } else {
      //   res.status(500).json({ error: 'Internal server error' });
      // }
    }
};

//Read
export const handleGetRecipientById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { recipientId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(recipientId)) {
      res.status(400).json({ error: 'Invalid recipient ID' });
      return;
    }

    const recipient = await recipientModel.findById(recipientId).exec();

    if (!recipient) {
      res.status(404).json({ error: 'Recipient not found' });
      return;
    }

    res.json(recipient);
  } catch (error) {
      if (error instanceof mongoose.Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
};

//Update
export const handleUpdateRecipientById = async ( req: Request, res: Response, recipientId: mongoose.Schema.Types.ObjectId | string | unknown ): Promise<void> => {
  try {
    const recepientName = req.body.recepientName;

    const updatedRecipient = await recipientModel.findByIdAndUpdate(recipientId, { recipientName: recepientName }, { new: true }).exec();

    if (!updatedRecipient) {
      res.status(404).json({ error: 'Recipient not found' });
      return;
    }
  } catch (error) {
      if (error instanceof mongoose.Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
};

//Delete
export const handleDeleteRecipientById = async (req: Request, res: Response, recipientId: mongoose.Schema.Types.ObjectId | string | unknown ): Promise<void> => {
  try {
    const deletedRecipient = await recipientModel.findByIdAndDelete(recipientId).exec();

    if (!deletedRecipient) {
      res.status(404).json({ error: 'Recipient not found' });
      return;
    }

    res.json({ message: 'Recipient deleted successfully' });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
