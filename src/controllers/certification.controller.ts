import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ProjectModel } from '../models/project.model';
import { RecipientModel } from '../models/recipient.model';
import { CertificationModel, Certification } from '../models/certification.model';
import { handleCreateRecipient } from './recipient.controller';

//Create
export const handleCreateCertification = async (req: Request, res: Response): Promise<Response> => {
  const { projectId, recipients } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    const project = await ProjectModel.findById(projectId).exec();

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.issuerId.toString() !== req.issuerId) {
      return res.json({ error: 'Issuer not matched' });
    }

    for(const value of recipients){
      let recipientId, imageURL;
      const newCertification: Certification = {
        issuerId: project.issuerId,
        recipientId,
        projectId,
        imageURL
      };

      const createdCertification = new CertificationModel(newCertification);
      await createdCertification.save();

      const recipient = await RecipientModel.findOne({ email: value.email }).exec();
      const recipientEmail = value.email;

      if (!recipient) {
        if (!await handleCreateRecipient(req, res, createdCertification._id, value)) {
          res.json({ error: `Error occurred while creating recipient ${value.recipientName}` });
          continue;
        }
      }
      else {
        await RecipientModel.findOneAndUpdate(
          { email: recipientEmail },
          { $push: { achievedCertifications: createdCertification._id } },
          { new: true }
        ).exec();
      }

      await ProjectModel.findByIdAndUpdate(
        projectId,
        { $push: { issuedCertificates: createdCertification._id }, stage: 'ISSUED' },
        { new: true }
      ).exec();
    }

    return res.status(201).json({ message: "All certificates are created successfully"});
  } catch (error) {
      if (error instanceof mongoose.Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
};

//Read One
export const handleGetCertificationById = async (req: Request, res: Response): Promise<Response> => {
  const { certificationId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(certificationId)) {
      return res.status(400).json({ error: 'Invalid certification ID' });
    }

    const certification = await CertificationModel.findById(certificationId);
    
    if (!certification) {
      return res.status(404).json({ error: 'Certification not found' });
    }
    
    return res.status(200).json(certification);
  } catch (error) {
      if (error instanceof mongoose.Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
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
// export const handleDeleteCertificationById = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { certificationId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(certificationId)) {
//       res.status(400).json({ error: 'Invalid certification ID' });
//       return;
//     }

//     const certification = await certificationModel.findById(certificationId);

//     if (!certification) {
//       res.status(404).json({ error: 'Certification not found' });
//       return;
//     }

//     await recipientModel.findByIdAndDelete(certification.recipientId).exec();

//     await projectModel.findByIdAndUpdate(certification.projectId, { $pull: { issuedCertificates: certification._id } }, { new: true }).exec();
    
//     await certificationModel.findByIdAndDelete(certificationId);
    
//     res.status(200).json({ message: 'Certification deleted successfully' });
//   } catch (error) {
//       if (error instanceof mongoose.Error) {
//         res.status(400).json({ error: error.message });
//       } else {
//         res.status(500).json({ error: 'Internal server error' });
//       }
//     }
// };
