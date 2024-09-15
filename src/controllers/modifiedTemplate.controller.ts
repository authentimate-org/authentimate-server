import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { ProjectModel } from '../models/project.model'
import { ModifiedTemplateModel, Component } from '../models/modifiedTemplate.model'
import { PremadeTemplateModel } from '../models/premadeTemplate.model'



//Save
export const handleSaveModifiedTemplate = async (req: Request, res: Response): Promise<Response> => {
  try{
    let { projectId } = req.body;
    const components = JSON.parse(req.body.design).design;
    console.log(components);
    let recipientName: Component | null= null;
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

    // if (!projectId) {
    //   projectId = "66979ab5e8393a333e0d6367";
    // }

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

    if (project.stage === 'PROJECT_CREATED') {
      return res.status(404).json({ error: 'Premade template not found.' });
    } else if ((project.stage === 'TEMPLATE_SELECTED' && project.modifiedTemplateId) || (project.stage === 'TEMPLATE_FINALISED')) {
      const updatedModifiedTemplate = await ModifiedTemplateModel.findByIdAndUpdate(
        project.modifiedTemplateId,
        { recipientName,
          qrCode,
          components
        },
        { new: true }
      );
      
      if (!updatedModifiedTemplate) {
        return res.status(404).json({ error: 'Modified template not found' });
      }

      return res.status(200).json({ message: "Modified template updated successfully." });
    } else if (project.stage === 'TEMPLATE_SELECTED') {
      const newModifiedTemplate = new ModifiedTemplateModel({
        projectId,
        issuerId: req.issuerId,
        recipientName,
        qrCode,
        components
      });

      await newModifiedTemplate.save();

      await ProjectModel.findByIdAndUpdate(
        projectId,
        { modifiedTemplateId: newModifiedTemplate._id },
        { new: true }
      ).exec();

      return res.status(201).json({ message: "Modified template created successfully." });
    } else {
      return res.status(400).json({ error: "You can't save the template at this stage." });
    }

  } catch (error) {
    if (error instanceof mongoose.Error) {
      return res.status(400).json({ error: error.message });
    } else {
      console.log(`Internal server error: ${error}`);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

//Finalise
export const handleFinaliseTemplate = async (req: Request, res: Response): Promise<Response> => {
  const { projectId } = req.body;

  try{
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

    if (project.stage === 'PROJECT_CREATED') {
      return res.status(404).json({ error: 'Template not found.' });
    } else if (project.stage === 'TEMPLATE_SELECTED' && project.modifiedTemplateId) {
      await ProjectModel.findByIdAndUpdate(
        projectId,
        { stage: 'TEMPLATE_FINALISED' },
        { new: true }
      ).exec();

      return res.status(200).json({ message: "Template finalised successfully." });
    } else if (project.stage === 'TEMPLATE_SELECTED') {
      const premadeTemplate = await PremadeTemplateModel.findById(project.templateId);
      
      const newModifiedTemplate = new ModifiedTemplateModel({
        projectId,
        issuerId: req.issuerId,
        recipientName: premadeTemplate?.recipientName,
        qrCode: premadeTemplate?.qrCode,
        components: premadeTemplate?.components
      });

      await newModifiedTemplate.save();

      await ProjectModel.findByIdAndUpdate(
        projectId,
        { modifiedTemplateId: newModifiedTemplate._id, stage: 'TEMPLATE_FINALISED' },
        { new: true }
      ).exec();

      return res.status(200).json({ message: "Template finalised successfully." });
    } else if (project.stage === 'CERTIFICATION_CREATED' || project.stage === 'MAIL_SENT' || project.stage === 'MAIL_NOT_SENT') {
      return res.status(400).json({ error: "You can't finalise the template at this stage." });
    } else {
      return res.status(400).json({ error: "A modified template for this project has already been finalized." }); 
    }

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

//Read One (not in use)
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
    components.push(modifiedTemplate.qrCode);

    return res.status(200).json(components);
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
