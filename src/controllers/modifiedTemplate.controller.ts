import { Request, Response } from 'express';
import { project, projectModel } from '../models/project.model';
import { modifiedTemplate, modifiedTemplateModel } from '../models/modifiedTemplate.model';
import { handleCreateRecipient , handleUpdateRecipientById, handleDeleteRecipientById } from './recipient.controller';
import mongoose from 'mongoose';

//Create
export const handleCreateModifiedTemplate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId, templateId, texts, recipientName, graphicElements, bgColor } = req.body;

    const newModifiedTemplate: modifiedTemplate = {
      projectId,
      templateId,
      texts,
      recipientName,
      graphicElements,
      bgColor
  };

    const project =  await projectModel.findById(projectId).exec();

    if(project?.stage !== 'PROJECT_CREATED' && project?.stage !== 'TEMPLATE_SELECTED') {
      res.json({ message: 'A template is already finalised for this project' });
      return ;
    }

    const createdModifiedTemplate = new modifiedTemplateModel(newModifiedTemplate);
    await createdModifiedTemplate.save();

    await projectModel.findByIdAndUpdate(projectId, { modifiedTemplateId: createdModifiedTemplate._id, stage: 'TEMPLATE_FINALISED' }, { new: true }).exec();

    res.status(201).json(createdModifiedTemplate);
  } catch (error) {
      if (error instanceof mongoose.Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
};

//Read One
export const handleGetModifiedTemplateById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { modifiedTemplateId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(modifiedTemplateId)) {
      res.status(400).json({ error: 'Invalid modified template ID' });
      return;
    }

    const modifiedTemplate = await modifiedTemplateModel.findById(modifiedTemplateId);

    if (!modifiedTemplate) {
      res.status(404).json({ error: 'Modified template not found' });
      return;
    }
    
    res.status(200).json(modifiedTemplate);
  } catch (error) {
      if (error instanceof mongoose.Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
};

//Update
export const handleUpdateModifiedTemplateById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { modifiedTemplateId } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(modifiedTemplateId)) {
      res.status(400).json({ error: 'Invalid modified template ID' });
      return;
    }

    const modifiedTemplate =  await modifiedTemplateModel.findById(modifiedTemplateId).exec();

    if (!modifiedTemplate) {
      res.status(404).json({ error: 'Modified template not found' });
      return ;
    }

    const project =  await projectModel.findById(updateData.projectId).exec();

    if(project?.modifiedTemplateId.toString() !== modifiedTemplateId) {
      res.json({ message: 'modified template ID did not match' });
      return ;
    }

    const updatedModifiedTemplate = await modifiedTemplateModel.findByIdAndUpdate(modifiedTemplateId, updateData, { new: true });
    
    if (!updatedModifiedTemplate) {
      res.status(404).json({ error: 'Modified template not found' });
      return;
    }

    res.status(200).json(updatedModifiedTemplate);
} catch (error) {
    if (error instanceof mongoose.Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

//Delete
export const handleDeleteModifiedTemplateById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { modifiedTemplateId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(modifiedTemplateId)) {
      res.status(400).json({ error: 'Invalid modifiedTemplate ID' });
      return;
    }

    const modifiedTemplate = await modifiedTemplateModel.findById(modifiedTemplateId);

    if (!modifiedTemplate) {
      res.status(404).json({ error: 'Modified template not found' });
      return;
    }

    await projectModel.findByIdAndUpdate(modifiedTemplate.projectId, { modifiedTemplateId: null, stage: 'TEMPLATE_SELECTED' }, { new: true }).exec();
    
    await modifiedTemplateModel.findByIdAndDelete(modifiedTemplateId);
        
    res.status(200).json({ message: 'Modified template deleted successfully' });
  } catch (error) {
      if (error instanceof mongoose.Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
};
