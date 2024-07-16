import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { ProjectModel } from '../models/project.model'
import { ModifiedTemplateModel, Component } from '../models/modifiedTemplate.model'



//Save
export const handleSaveModifiedTemplate = async (req: Request, res: Response): Promise<Response> => {
  try{
    let { projectId } = req.body;
    const components = JSON.parse(req.body.design).design;
    let recipientName: Component | null= null;
    let qrcode: Component | null = null;

    for (let i = 0; i < components.length; i++) {
      if(recipientName === null || qrcode === null) {
        if (components[i].type === 'recipientName') {
          recipientName = components.splice(i, 1)[0];
          i--;
        } else if (components[i].type === 'qrcode') {
          qrcode = components.splice(i, 1)[0];
          i--;
        }
      }
      else break; //Need optimization
    }

    if (!projectId) {
      projectId = "669010a4a1d102549f432e92";
    }

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

    if (project.stage === 'TEMPLATE_SELECTED') {
      const newModifiedTemplate = new ModifiedTemplateModel({
        projectId,
        issuerId: req.issuerId,
        recipientName,
        qrcode,
        components
      });

      await newModifiedTemplate.save();

      await ProjectModel.findByIdAndUpdate(
        projectId,
        { modifiedTemplateId: newModifiedTemplate._id, stage: 'TEMPLATE_FINALISED' },
        { new: true }
      ).exec();
    } else if (project.stage === 'TEMPLATE_FINALISED') {
      const updatedModifiedTemplate = await ModifiedTemplateModel.findByIdAndUpdate(
        project.modifiedTemplateId,
        { recipientName,
          qrcode,
          components
        },
        { new: true }
      );
      
      if (!updatedModifiedTemplate) {
        return res.status(404).json({ error: 'Modified template not found' });
      }
    } else {
      return res.status(401).json({ error: "You can't save the template at this stage." });
    }

    return res.status(201).json({ message: "Template saved." });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return res.status(400).json({ error: error.message });
    } else {
      console.log(`Internal server error: ${error}`);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

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
export const handleGetModifiedTemplateByProjectId = async (req: Request, res: Response): Promise<Response> => {
  const { projectId } = req.body;

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

    const modifiedTemplate = await ModifiedTemplateModel.findById(project.modifiedTemplateId);

    if (!modifiedTemplate) {
      return res.status(404).json({ error: 'Modified template not found.' });
    }

    const components: Component[] = modifiedTemplate.components;
    components.push(modifiedTemplate.recipientName);
    components.push(modifiedTemplate.qrcode);

    return res.status(200).json({ "_id": modifiedTemplate._id, "components": components });
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
