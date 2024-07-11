import { Request, Response, NextFunction } from 'express';
import userImageModel from '../models/userImageModel';
import mongoose from 'mongoose';
import formidable from 'formidable';
import cloudinary from 'cloudinary';

const addUserImage = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
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
    const { fields, files } = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const image = files.image;
    if (!Array.isArray(image) || image.length === 0) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const { secure_url } = await cloudinary.v2.uploader.upload(image[0].filepath);

    const userImage = await userImageModel.create({
      user_id: new mongoose.Types.ObjectId(issuerId),
      image_url: secure_url,
    });

    return res.status(201).json({ userImage });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserImage = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const { issuerId } = req;

  if (!issuerId) {
    return res.status(401).json({ message: 'Unauthorized (no issuerId found)' });
  }

  try {
    const images = await userImageModel.find({ user_id: new mongoose.Types.ObjectId(issuerId) });
    return res.status(200).json({ images });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export { addUserImage, getUserImage };
