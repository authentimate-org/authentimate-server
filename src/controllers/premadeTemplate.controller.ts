import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { PremadeTemplateModel, Component } from '../models/premadeTemplate.model'



//Create
export const handleCreatePremadeTemplate = async (req: Request, res: Response): Promise<Response> => {
  try {
    // const { imageURL } = req.body;
    const components = JSON.parse(req.body.design).design;
    // console.log(components);
    const imageURL = "https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/img/car_4.png";
    let recipientName: Component | null = null;
    let qrCode: Component | null = null;

    for (let i = 0; i < components.length; i++) {
      if(recipientName === null || qrCode === null) {
        if (components[i].type === 'recipientName') {
          recipientName = components.splice(i, 1)[0];
          i--;
        } else if (components[i].type === 'qrCode') {
          qrCode = components.splice(i, 1)[0];
          i--;
        }
      }
      else break; //Need optimization
    }

    const newPremadeTemplate = new PremadeTemplateModel({
      recipientName,
      qrCode,
      components,
      templateImageURL: imageURL
    });

    await newPremadeTemplate.save();

    return res.status(201).json({ message: "Premade template created successfully." });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

//Read All
export const handleGetAllPremadeTemplates = async (req: Request, res: Response): Promise<Response> => {
  try {
    const allPremadeTemplates = await PremadeTemplateModel.find({}, '_id templateImageURL').exec();

    if (!allPremadeTemplates) {
      return res.status(404).json({ error: 'Premade templates not found' });
    }

    return res.status(200).json(allPremadeTemplates);
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

//Read One
export const handleGetPremadeTemplateById = async (req: Request, res: Response): Promise<Response> => {
  const { premadeTemplateId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(premadeTemplateId)) {
      return res.status(400).json({ error: 'Invalid premade template ID' });
    }

    const premadeTemplate = await PremadeTemplateModel.findById(premadeTemplateId);

    if (!premadeTemplate) {
      return res.status(404).json({ error: 'Premade template not found' });
    }

    const components: Component[] = premadeTemplate.components;
    components.push(premadeTemplate.recipientName);
    components.push(premadeTemplate.qrCode);

    return res.status(200).json({ components: components });
    // return res.status(200).json(premadeTemplate);
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

//Delete
export const handleDeletePremadeTemplateById = async (req: Request, res: Response): Promise<Response> => {
  const { premadeTemplateId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(premadeTemplateId)) {
      return res.status(400).json({ error: 'Invalid Premade template ID' });
    }

    const deletedPremadeTemplate = await PremadeTemplateModel.findByIdAndDelete(premadeTemplateId);

    if (!deletedPremadeTemplate) {
      return res.status(404).json({ error: 'Premade template not found' });
    }

    return res.status(200).json({ message: 'Premade template deleted successfully' });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

