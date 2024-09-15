import { Request, Response, NextFunction } from 'express';
import { IssuerImageModel } from '../models/issuerImage.model';
import mongoose from 'mongoose';
import formidable from 'formidable';
import cloudinary from 'cloudinary';



export const handleAddIssuerImage = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const { issuerId } = req;

  if (!issuerId) {
    return res.status(401).json({ message: 'Unauthorized (no issuerId found)' });
  }

  const form = formidable({});

  cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME!,
    api_key: process.env.API_KEY!,
    api_secret: process.env.API_SECRET!,
  });

  try {
    const { fields, files } = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
      form.parse(req, (err:any, fields:any, files:any) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const image = files.image;
    if (!Array.isArray(image) || image.length === 0) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const { secure_url } = await cloudinary.v2.uploader.upload(image[0].filepath);

    const issuerImage = await IssuerImageModel.create({
      issuerId: new mongoose.Types.ObjectId(issuerId),
      imageUrl: secure_url,
    });

    return res.status(201).json({ userImage: issuerImage });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const handleGetIssuerImage = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const { issuerId } = req;

  if (!issuerId) {
    return res.status(401).json({ message: 'Unauthorized (no issuerId found)' });
  }

  try {
    const images = await IssuerImageModel.find({ issuerId: new mongoose.Types.ObjectId(issuerId) });
    return res.status(200).json({ images });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};