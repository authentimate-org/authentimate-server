import { Request, Response } from 'express';
import mongoose from 'mongoose';
import QRCode from 'qrcode';
// import transporter from '../config/transporter';
import mailer from '../utils/mailer';
import { emailValidator } from '../middleware/emailValidator.middleware';
import { IssuerModel } from '../models/issuer.model'
import { ProjectModel } from '../models/project.model';
import { RecipientModel } from '../models/recipient.model';
import { ModifiedTemplateModel, Component } from '../models/modifiedTemplate.model';
import { CertificationModel, Certification } from '../models/certification.model';
import { handleCreateRecipient } from './recipient.controller';



interface Res {
  email: string | undefined;
  isCertificationCreated: boolean;
  certificationId?: string | undefined;
  error?: string
}

async function generateQRCode(certificaionId: string): Promise<string> {
  try {
    const certificateUrl = `http://${process.env.DOMAIN_IP}:5000/api/v2/certification/${certificaionId}`;
    const qrCode = await QRCode.toDataURL(certificateUrl);

    return qrCode;
  } catch (error) {
    console.log('--------Error in generateQRCode---------');
    throw error;
  }
}

//Create
export const handleCreateCertification = async (req: Request, res: Response): Promise<Response> => {
  const { projectId, recipients } = req.body;
  const response: Res[] = [];

  try {
    if (!req.user || !req.issuerId) {
      return res.status(401).json({ error: 'Unauthorized (user not found)' });
    }

    const issuer = await IssuerModel.findById(req.issuerId).exec();

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    const project = await ProjectModel.findById(projectId).exec();

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.issuerId.toString() !== req.issuerId) {
      return res.status(401).json({ error: 'Unauthorized (issuer not matched)' });
    }

    for (const recipient of recipients) {
      const isEmailValid = await emailValidator(recipient.email);

      if (isEmailValid !== 'Valid email') {
        response.push({
          email: recipient.email,
          isCertificationCreated: false,
          error: isEmailValid
        });
        continue;
      }

      const oldRecipient = await RecipientModel.findOne({ email: recipient.email }).exec();

      let createdCertification;
      
      if (!oldRecipient) {
        const newCertification: Certification = new CertificationModel({
          issuerId: project.issuerId,
          recipientName: recipient.recipientName,
          projectId,
        });
  
        createdCertification = await newCertification.save();

        if (!await handleCreateRecipient(req, res, createdCertification._id, recipient.email)) {
          response.push({
            email: recipient.email,
            isCertificationCreated: false,
            error: 'Error occurred while creating this recipient'
          });
          continue;
        }
      } else {
        const certification = await CertificationModel.findOne({ projectId, recipientId: recipient._id });

        if (certification) {
          response.push({
            email: recipient.email,
            isCertificationCreated: false,
            error: 'Recipient has already received a certificate in this project.'
          });
          continue;
        }

        const newCertification: Certification = new CertificationModel({
          issuerId: project.issuerId,
          recipientId: oldRecipient._id,
          recipientName: recipient.recepientName,
          projectId,
        });
  
        createdCertification = await newCertification.save();

        await RecipientModel.findByIdAndUpdate(
          oldRecipient._id,
          { $push: { achievedCertifications: createdCertification._id } },
          { new: true }
        ).exec();
      }

      await ProjectModel.findByIdAndUpdate(
        projectId,
        { $push: { issuedCertificates: createdCertification._id }, stage: 'ISSUED' },
        { new: true }
      ).exec();

      response.push({
        email: recipient?.email,
        isCertificationCreated: true,
        certificationId: createdCertification.certificationId,
      });
      
      const certificateUrl = `http://${process.env.DOMAIL_IP}:5000/api/v2/certification/${createdCertification.certificationId}`;

      await mailer(recipient.email, recipient.recipientName, (issuer?.companyName || issuer?.instituteName || issuer?.issuerName), certificateUrl);

    }

    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

//Read All
export const handleGetAllCertificationsByProjectId = async (req: Request, res: Response): Promise<Response> => {
  const { projectId } = req.body;

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
  
    const allCertifications = await CertificationModel.find({projectId: projectId}).exec();
  
    if (!allCertifications) {
      return res.status(404).json({ error: 'Certificates not found' });
    }
  
    return res.json(allCertifications);
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
  const { certificationId } = req.params;

  try {
    const certification = await CertificationModel.findOne({ certificationId }).exec();

    const issuer = await IssuerModel.findById(certification?.issuerId).exec();

    const recipient = await RecipientModel.findById(certification?.recipientId).exec();
    
    const project = await ProjectModel.findById(certification?.projectId).exec();

    const modifiedTemplate = await ModifiedTemplateModel.findById(project?.modifiedTemplateId);

    const qrCode = await generateQRCode(certificationId);

    if (!certification || !issuer || !recipient || !project || !modifiedTemplate || !qrCode) {
      return res.status(404).json({ error: 'Certification not found.' });
    }

    modifiedTemplate.recipientName.title = certification.recipientName;
    modifiedTemplate.qrCode.image = qrCode;

    const components: Component[] = modifiedTemplate.components;
    components.push(modifiedTemplate.recipientName);
    components.push(modifiedTemplate.qrCode);

    const response =  {
      "Issuer's details": {
        "Issued by": issuer.companyName || issuer.instituteName || issuer.issuerName,
        "Category": issuer.category,
        "Business mail": issuer.businessMail,
        "Designation": issuer.designation,
        "Address": issuer.address
      },
      "Recipient's details": {
        "Recipient name": certification.recipientName,
        "Email address": recipient.email
      },
      "Project's details": {
        "Project name": project.projectName,
        "Category": project.category
      },
      "Date of issue": certification.createdAt,
      components
    }

    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return res.status(400).json({ error: error.message });
    } else {
      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

//Update
export const handleUpdateCertificationByCertificationId = async (req: Request, res: Response): Promise<Response> => {
  const { certificationId, recipientName } = req.body;

  try {
    if (!req.user || !req.issuerId) {
      return res.status(401).json({ error: 'Unauthorized (user not found)' });
    }

    if (!certificationId || !recipientName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const certification = await CertificationModel.findOne({ certificationId }).exec();

    if (!certification) {
      return res.status(404).json({ error: 'Certification not found' });
    }

    if (certification.issuerId.toString() !== req.issuerId) {
      return res.status(401).json({ error: 'Unauthorized (issuer not matched)' });
    }

    await CertificationModel.findOneAndUpdate({ certificationId }, { recipientName }, { new: true });

    return res.status(200).json({ message: 'Certification updated successfully' });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};


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
