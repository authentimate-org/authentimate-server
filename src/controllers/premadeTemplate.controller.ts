import { Request, Response } from 'express';
import { premadeTemplate, premadeTemplateModel } from '../models/premadeTemplate.model';
import mongoose from 'mongoose';

//Create
export const handleCreatePremadeTemplate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { texts, recipientName, graphicElements, bgColor, templateImageURL } = req.body;

    const newPremadeTemplate: premadeTemplate = {
      texts,
      recipientName,
      graphicElements,
      bgColor,
      templateImageURL
    };

    const createdPremadeTemplate = new premadeTemplateModel(newPremadeTemplate);
    await createdPremadeTemplate.save();

    res.status(201).json(createdPremadeTemplate);
  } catch (error) {
      if (error instanceof mongoose.Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
};

//Read All
export const handleGetAllPremadeTemplates = async (req: Request, res: Response): Promise<void> => {
  try {
    const allPremadeTemplates = await premadeTemplateModel.find({});

    res.status(200).json(allPremadeTemplates);
  } catch (error) {
      if (error instanceof mongoose.Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
};

//Read One
export const handleGetPremadeTemplateById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { premadeTemplateId } = req.params;
    const premadeTemplate = await premadeTemplateModel.findById(premadeTemplateId);

    if (!premadeTemplate) {
      res.status(404).json({ error: 'Premade template not found' });
      return;
    }

    res.status(200).json(premadeTemplate);
  } catch (error) {
      if (error instanceof mongoose.Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
};

//Update


//Delete One
export const handleDeletePremadeTemplateById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { premadeTemplateId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(premadeTemplateId)) {
      res.status(400).json({ error: 'Invalid Premade template ID' });
      return;
    }

    const deletedPremadeTemplate = await premadeTemplateModel.findByIdAndDelete(premadeTemplateId);

    if (!deletedPremadeTemplate) {
      res.status(404).json({ error: 'Premade template not found' });
      return;
    }

    res.status(200).json({ message: 'Premade template deleted successfully' });
  } catch (error) {
      if (error instanceof mongoose.Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
};

