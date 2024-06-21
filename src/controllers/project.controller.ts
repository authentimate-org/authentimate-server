import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { IssuerModel } from '../models/issuer.model'
import { Project, ProjectModel } from '../models/project.model'
import { ModifiedTemplateModel } from '../models/modifiedTemplate.model'
import { RecipientModel } from '../models/recipient.model'
import { CertificationModel } from '../models/certification.model'
import { PremadeTemplateModel } from '../models/premadeTemplate.model'

// Create
export const handleCreateProject = async (req: Request, res: Response): Promise<Response> => {
  const { projectName, category } = req.body;

  try {
    if (!req.user || !req.issuerId) {
      return res.status(401).json({ error: 'Unauthorized (user not found)' });
    }

    const newProject: Project = new ProjectModel({
      projectName,
      category: category as 'EVENT' | 'COURSE' | 'COMPETITION',
      issuerId: req.issuerId,
    });

    const createdProject = await newProject.save();
    return res.status(201).json({ createdProject });
  } catch (error) {
    console.error('Error in handleCreateProject:', error);
    if (error instanceof mongoose.Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

//Read All
export const handleGetAllProjectsByIssuerId = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.user || !req.issuerId) {
      return res.status(401).json({ error: 'Unauthorized (user not found)' });
    }
  
    if (!mongoose.Types.ObjectId.isValid(req.issuerId)) {
      return res.status(400).json({ error: 'Invalid issuer ID' });
    }
  
    const allProjects = await ProjectModel.find({issuerId: req.issuerId}).exec();
  
    if (!allProjects) {
      return res.status(404).json({ error: 'Projects not found' });
    }
  
    return res.json(allProjects);
  } catch (error) {
      if (error instanceof mongoose.Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
};

// //Read One
export const handleGetProjectById = async (req: Request, res: Response): Promise<Response> => {
  const { projectId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    const project = await ProjectModel.findById(projectId).exec();

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    return res.json(project);
  } catch (error) {
      if (error instanceof mongoose.Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
};

// //Update
export const handleUpdateProjectById = async (req: Request, res: Response): Promise<Response> => {
  const { projectId, projectName, category } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    const updatedProject = await ProjectModel.findByIdAndUpdate(
      projectId,
      { projectName: projectName, category: category },
      { new: true }
    ).exec();

    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    return res.json(updatedProject);
  } catch (error) {
      if (error instanceof mongoose.Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return  res.status(500).json({ error: 'Internal server error' });
      }
    }
};
export const handleSelectPremadeTemplate = async (req: Request, res: Response): Promise<Response> => {
  const { projectId, premadeTemplateId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }
    if (!mongoose.Types.ObjectId.isValid(premadeTemplateId)) {
      return res.status(400).json({ error: 'Invalid premade template ID' });
    }

    const premadeTemplate = await PremadeTemplateModel.findById(premadeTemplateId);

    if (!premadeTemplate) {
      return res.status(404).json({ error: 'Premade template not found' });
    }

    const project =  await ProjectModel.findById(projectId).exec();

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    if(project.stage !== 'PROJECT_CREATED') {
      return res.json({ message: 'A template is already selected for this project' });
    }

    const updatedProject = await ProjectModel.findByIdAndUpdate(
      projectId,
      { templateId: premadeTemplateId, stage: 'TEMPLATE_SELECTED' },
      { new: true }
    ).exec();

    return res.json(updatedProject);
  } catch (error) {
      if (error instanceof mongoose.Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
};
export const handleRemovePremadeTemplate = async (req: Request, res: Response): Promise<Response> => {
  const { projectId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    const project =  await ProjectModel.findById(projectId).exec();

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const premadeTemplateId = project.templateId;

    if(!premadeTemplateId) {
      return res.json({ error: 'No template has been selected yet' });
    }
    if(project.stage === 'TEMPLATE_FINALISED' || project.stage === 'ISSUED') {
      return res.json({ message: 'You cannot remove the template at this stage' });
    }

    const updatedProject = await ProjectModel.findByIdAndUpdate(
      projectId,
      { templateId: null , stage: 'PROJECT_CREATED' },
      { new: true }
    ).exec();

    return res.json(updatedProject);
  } catch (error) {
      if (error instanceof mongoose.Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
};

// //Delete
export const handleDeleteProjectById = async (req: Request, res: Response): Promise<Response> => {
  const { projectId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    const project = await ProjectModel.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await ModifiedTemplateModel.findByIdAndDelete(project.modifiedTemplateId);

    await RecipientModel.deleteMany({ projectId: projectId });

    await CertificationModel.deleteMany({ projectId: projectId });

    await IssuerModel.findByIdAndUpdate(project.issuerId, { $pull: { createdProjects: projectId } }, { new: true }).exec();

    await ProjectModel.findByIdAndDelete(projectId).exec();

    return res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};
