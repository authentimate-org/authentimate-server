import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { PremadeTemplate, PremadeTemplateModel } from '../models/premadeTemplate.model'

//Create
export const handleCreatePremadeTemplate = async (req: Request, res: Response): Promise<Response> => {
  const { texts, recipientName, graphicElements, bgColor, templateImageURL } = req.body;

  try {
    const newPremadeTemplate: PremadeTemplate = {
      texts,
      recipientName,
      graphicElements,
      bgColor,
      templateImageURL
    };

    const createdPremadeTemplate = new PremadeTemplateModel(newPremadeTemplate);
    await createdPremadeTemplate.save();

    return res.status(201).json(createdPremadeTemplate);
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
    const allPremadeTemplates = await PremadeTemplateModel.find({});

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
      return res.status(400).json({ error: 'Invalid pemade template ID' });
    }

    const premadeTemplate = await PremadeTemplateModel.findById(premadeTemplateId);

    if (!premadeTemplate) {
      return res.status(404).json({ error: 'Premade template not found' });
    }

    return res.status(200).json(premadeTemplate);
  } catch (error) {
      if (error instanceof mongoose.Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
};

//Update


//Delete One
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

