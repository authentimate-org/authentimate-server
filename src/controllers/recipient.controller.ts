import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { RecipientModel, Recipient } from '../models/recipient.model';
import { CertificationModel, Certification } from '../models/certification.model';

//Create
export const handleCreateRecipient = async ( req: Request, res: Response, certificationId: mongoose.Schema.Types.ObjectId | unknown, email: string ): Promise<boolean> => {
  try {
    const newRecipient: Recipient = new RecipientModel({ email, achievedCertifications: [ certificationId ] });

    const createdRecipient = await newRecipient.save();
    // await createdRecipient.save();

    if (!createdRecipient) {
      await CertificationModel.findByIdAndDelete(certificationId);
      return false;
    }

    await CertificationModel.findByIdAndUpdate(
      certificationId,
      { recipientId: createdRecipient._id },
      { new: true }
    ).exec();

    // await RecipientModel.findByIdAndUpdate(
    //   createdRecipient._id,
    //   { $push: { achievedCertifications: certificationId } },
    //   { new: true }
    // ).exec();

    return true;
  } catch (error) {
    await CertificationModel.findByIdAndDelete(certificationId);
    
    if (error instanceof mongoose.Error) {
      res.status(400).json({ error: error.message });
      return false;
    } else {
      res.status(500).json({ error: 'Internal server error' });
      return false;
    }
  }
};

//Read
export const handleGetRecipientById = async (req: Request, res: Response): Promise<Response> => {
  const { recipientId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(recipientId)) {
      return res.status(400).json({ error: 'Invalid recipient ID' });
    }

    const recipient = await RecipientModel.findById(recipientId).exec();

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    return res.json(recipient);
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

//Update
// export const handleUpdateRecipientById = async ( req: Request, res: Response, recipientId: mongoose.Schema.Types.ObjectId | string | unknown ): Promise<void> => {
//   try {
//     const recepientName = req.body.recepientName;

//     const updatedRecipient = await recipientModel.findByIdAndUpdate(recipientId, { recipientName: recepientName }, { new: true }).exec();

//     if (!updatedRecipient) {
//       res.status(404).json({ error: 'Recipient not found' });
//       return;
//     }
//   } catch (error) {
//       if (error instanceof mongoose.Error) {
//         res.status(400).json({ error: error.message });
//       } else {
//         res.status(500).json({ error: 'Internal server error' });
//       }
//     }
// };

//Delete
// export const handleDeleteRecipientById = async (req: Request, res: Response, recipientId: mongoose.Schema.Types.ObjectId | string | unknown ): Promise<void> => {
//   try {
//     const deletedRecipient = await recipientModel.findByIdAndDelete(recipientId).exec();

//     if (!deletedRecipient) {
//       res.status(404).json({ error: 'Recipient not found' });
//       return;
//     }

//     res.json({ message: 'Recipient deleted successfully' });
//   } catch (error) {
//     if (error instanceof mongoose.Error) {
//       res.status(400).json({ error: error.message });
//     } else {
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }
// };
