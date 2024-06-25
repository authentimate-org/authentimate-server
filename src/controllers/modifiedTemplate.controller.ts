import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { ProjectModel } from '../models/project.model'
import { ModifiedTemplate, ModifiedTemplateModel } from '../models/modifiedTemplate.model'

//Create
export const handleCreateModifiedTemplate = async (req: Request, res: Response): Promise<Response> => {
  const { projectId, texts, recipientName, graphicElements, bgColor } = req.body;

  try {
    if (!req.user || !req.issuerId) {
      return res.status(401).json({ error: 'Unauthorised (user not found)' });
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    const project =  await ProjectModel.findById(projectId).exec();

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.issuerId.toString() != req.issuerId) {
      return res.status(401).json({ error: 'Unauthorized (issuer not matched)' });
    }
    
    const premadeTemplateId = project.templateId;

    if (!premadeTemplateId) {
      return res.json({ error: 'No template has been selected yet' });
    }

    if(project.stage === 'TEMPLATE_FINALISED' || project.stage === 'ISSUED') {
      return res.json({ message: 'A template is already finalised for this project' });
    }

    const newModifiedTemplate: ModifiedTemplate = {
      projectId,
      templateId: premadeTemplateId,
      texts,
      recipientName,
      graphicElements,
      bgColor
    };

    const createdModifiedTemplate = new ModifiedTemplateModel(newModifiedTemplate);
    await createdModifiedTemplate.save();

    await ProjectModel.findByIdAndUpdate(
      projectId,
      { modifiedTemplateId: createdModifiedTemplate._id, stage: 'TEMPLATE_FINALISED' },
      { new: true }
    ).exec();

    return res.status(201).json(createdModifiedTemplate);
  } catch (error) {
      if (error instanceof mongoose.Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
};

//Read All
export const handleGetAllModifiedTemplatesByIssuerId = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.user || !req.issuerId) {
      return res.status(401).json({ error: 'Unauthorized (user not found)' });
    }
  
    const allModifiedTemplates = await ModifiedTemplateModel.find({ issuerId: req.issuerId }).exec();
  
    if (!allModifiedTemplates) {
      return res.status(404).json({ error: 'Modified templates not found' });
    }
  
    return res.json(allModifiedTemplates);
  } catch (error) {
      if (error instanceof mongoose.Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
};

//Read One
export const handleGetModifiedTemplateById = async (req: Request, res: Response): Promise<Response> => {
  const { modifiedTemplateId } = req.body;

  try {
    if (!req.user || !req.issuerId) {
      return res.status(401).json({ error: 'Unauthorised (user not found)' });
    }

    if (!mongoose.Types.ObjectId.isValid(modifiedTemplateId)) {
      return res.status(400).json({ error: 'Invalid modified template ID' });
    }

    const modifiedTemplate = await ModifiedTemplateModel.findById(modifiedTemplateId);

    if (!modifiedTemplate) {
      return res.status(404).json({ error: 'Modified template not found' });
    }

    const project =  await ProjectModel.findById(modifiedTemplate.projectId).exec();

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.issuerId.toString() != req.issuerId) {
      return res.status(401).json({ error: 'Unauthorised (issuer not matched)' });
    }

    return res.status(200).json(modifiedTemplate);
  } catch (error) {
      if (error instanceof mongoose.Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
};

//Update
export const handleUpdateModifiedTemplateById = async (req: Request, res: Response): Promise<Response> => {
  const { modifiedTemplateId, texts, recipientName, graphicElements, bgColor } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(modifiedTemplateId)) {
      return res.status(400).json({ error: 'Invalid modified template ID' });
    }

    const updatedModifiedTemplate = await ModifiedTemplateModel.findByIdAndUpdate(
      modifiedTemplateId,
      { texts: texts, recipientName: recipientName, graphicElements: graphicElements, bgColor: bgColor },
      { new: true }
    );
    
    if (!updatedModifiedTemplate) {
      return res.status(404).json({ error: 'Modified template not found' });
    }

    return res.status(200).json(updatedModifiedTemplate);
} catch (error) {
    if (error instanceof mongoose.Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

//Delete
export const handleDeleteModifiedTemplateById = async (req: Request, res: Response): Promise<Response> => {
  const { modifiedTemplateId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(modifiedTemplateId)) {
      return res.status(400).json({ error: 'Invalid modifiedTemplate ID' });
    }

    const modifiedTemplate = await ModifiedTemplateModel.findById(modifiedTemplateId);

    if (!modifiedTemplate) {
      return res.status(404).json({ error: 'Modified template not found' });
    }

    await ProjectModel.findByIdAndUpdate(
      modifiedTemplate.projectId,
      { modifiedTemplateId: null, stage: 'TEMPLATE_SELECTED' },
      { new: true }
    ).exec();
    
    await ModifiedTemplateModel.findByIdAndDelete(modifiedTemplateId);
        
    return res.status(200).json({ message: 'Modified template deleted successfully' });
  } catch (error) {
      if (error instanceof mongoose.Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
};
