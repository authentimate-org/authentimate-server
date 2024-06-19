import { Request, Response } from 'express';
import { project, projectModel } from '../models/project.model';
import { modifiedTemplate, modifiedTemplateModel } from '../models/modifiedTemplate.model';
import { recipientModel, recipient } from '../models/recipient.model';
import { certificationModel, certification } from '../models/certification.model';
import mongoose from 'mongoose';
import { handleCreateRecipient } from './recipient.controller';

//Create
export const handleCreateCertification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId, recipients } = req.body;

    const project = await projectModel.findById(projectId).exec();
    
    const issuerId = project?.issuerId;
    let recipientId, imageURL;

    for(const value of recipients){
      const newCertification: certification = {
        issuerId,
        recipientId,
        projectId,
        imageURL
      };

      const createdcertification = new certificationModel(newCertification);
      await createdcertification.save();

      const recipient = await recipientModel.findOne({ email: value.email }).exec();
      const recipientEmail = value.email;

      if (!recipient) {

        await handleCreateRecipient(req, res, createdcertification._id, value);
      }
      else {
        await recipientModel.findOneAndUpdate({ email: recipientEmail }, { $push: { achievedCertifications: createdcertification._id } }, { new: true }).exec();
      }

      await projectModel.findByIdAndUpdate(projectId, { $push: { issuedCertificates: createdcertification._id }, stage: 'ISSUED' }, { new: true }).exec();

    }

    res.status(201).json({ message: "All certificates are created successfully"});
  } catch (error) {
      if (error instanceof mongoose.Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
};

//Read One
export const handleGetCertificationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { certificationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(certificationId)) {
      res.status(400).json({ error: 'Invalid certification ID' });
      return;
    }

    const certification = await certificationModel.findById(certificationId);
    
    if (!certification) {
      res.status(404).json({ error: 'Certification not found' });
      return;
    }
    
    res.status(200).json(certification);
  } catch (error) {
      if (error instanceof mongoose.Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
};

//Update
// export const handleUpdateCertificationById = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     const updatedCertification = await certificationModel.findByIdAndUpdate(id, updateData, { new: true });

//     if (!updatedCertification) {
//       res.status(404).json({ error: 'Certification not found' });
//       return;
//     }

//     res.status(200).json(updatedCertification);
// } catch (error) {
//     if (error instanceof mongoose.Error) {
//       res.status(400).json({ error: error.message });
//     } else {
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }
// };

//Delete
export const handleDeleteCertificationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { certificationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(certificationId)) {
      res.status(400).json({ error: 'Invalid certification ID' });
      return;
    }

    const certification = await certificationModel.findById(certificationId);

    if (!certification) {
      res.status(404).json({ error: 'Certification not found' });
      return;
    }

    await recipientModel.findByIdAndDelete(certification.recipientId).exec();

    await projectModel.findByIdAndUpdate(certification.projectId, { $pull: { issuedCertificates: certification._id } }, { new: true }).exec();
    
    await certificationModel.findByIdAndDelete(certificationId);
    
    res.status(200).json({ message: 'Certification deleted successfully' });
  } catch (error) {
      if (error instanceof mongoose.Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
};
