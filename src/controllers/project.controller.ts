import { Request, Response } from 'express'
import mongoose, { Document, Schema } from 'mongoose'
import { IssuerModel } from '../models/issuer.model'
import { Project, ProjectModel } from '../models/project.model'
import { PremadeTemplateModel, PremadeTemplate } from '../models/premadeTemplate.model'
import { ModifiedTemplateModel, Component } from '../models/modifiedTemplate.model'
import { RecipientModel } from '../models/recipient.model'
import { CertificationModel } from '../models/certification.model'


interface ProjectResponse {
  _id: string | unknown;
  projectName: string;
  category: 'EVENT' | 'COURSE' | 'COMPETITION';
  templateId: string | null;
  modifiedTemplateId?: string | null;
  stage: 'PROJECT_CREATED' | 'TEMPLATE_SELECTED' | 'TEMPLATE_FINALISED' | 'CERTIFICATION_CREATED' | 'MAIL_SENT' | 'MAIL_NOT_SENT';
  components?: Component[];
}

interface PopulatedProject extends Omit<Project, 'templateId'> {
  templateId: PremadeTemplate;
}

// Create
export const handleCreateProject = async (req: Request, res: Response): Promise<Response> => {
  const { projectName, category } = req.body;

  try {
    if (!req.user || !req.issuerId) {
      return res.status(401).json({ error: 'Unauthorised (user not found)' });
    }

    const project = await ProjectModel.find({ issuerId: req.issuerId, projectName: projectName, category: category }).exec();

    if (project.length !== 0) {
      return res.status(400).json({ error: 'A project with this name already exists in this category'});
    }

    const newProject: Project = new ProjectModel({
      projectName,
      category: category as 'EVENT' | 'COURSE' | 'COMPETITION',
      issuerId: req.issuerId,
    });

    const createdProject = await newProject.save();

    await IssuerModel.findByIdAndUpdate(
      req.issuerId,
      { $push: { createdProjects: createdProject._id } },
      { new: true }
    ).exec();

    return res.status(201).json({ message: 'Project created successfully.', _id: createdProject._id, stage: createdProject.stage });
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

    const allProjects = await ProjectModel
    .find({ issuerId: req.issuerId })
    .select('_id projectName category stage templateId')
    .populate({ path: 'templateId', select: 'templateImageURL', model: PremadeTemplateModel })
    .sort({ createdAt: -1 })
    .exec();
    const issuer = await IssuerModel.findById(req.issuerId, 'totalCertifications').exec();
  
    if (allProjects.length === 0) {
      return res.status(404).json({ error: 'Projects not found' });
    }

    const allProjectsResp = allProjects.map(project => {
      const populatedProject = project as unknown as PopulatedProject;

      return {
        _id: populatedProject._id,
        projectName: populatedProject.projectName,
        category: populatedProject.category,
        stage: populatedProject.stage,
        templateImageUrl: populatedProject.templateId?.templateImageURL ?? null,
      };
    });
  
    return res.status(200).json({ projects: allProjectsResp, totalCertifications: issuer?.totalCertifications });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

//Get Project
export const handleGetProjectById = async (req: Request, res: Response): Promise<Response> => {
  const { projectId } = req.body;

  try {
    if (!req.user || !req.issuerId) {
      return res.status(401).json({ error: 'Unauthorized (user not found)' });
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    const project = await ProjectModel.findById(projectId).exec();

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.issuerId.toString() != req.issuerId) {
      return res.status(401).json({ error: 'Unauthorized (issuer not matched)' });
    }

    let response: ProjectResponse = {
      _id: project._id,
      projectName: project.projectName,
      category: project.category,
      stage: project.stage,
      templateId: project.templateId?._id.toString() || null,
      modifiedTemplateId: project.modifiedTemplateId?.toString() || null,
    };

    if (project.stage === 'PROJECT_CREATED') {
    } else if ((project.stage === 'TEMPLATE_SELECTED' && project.modifiedTemplateId) || (project.stage === 'TEMPLATE_FINALISED')) {
      const modifiedTemplate = await ModifiedTemplateModel.findById(project.modifiedTemplateId);

      if (!modifiedTemplate) {
        return res.status(404).json({ error: 'Modified template not found.' });
      }
  
      response.components = modifiedTemplate.components;
      response.components.push(modifiedTemplate.recipientName);
      response.components.push(modifiedTemplate.qrCode);
    } else if (project.stage === 'TEMPLATE_SELECTED') {
      const premadeTemplate = await PremadeTemplateModel.findById(project.templateId);

      if (!premadeTemplate) {
        return res.status(404).json({ error: 'Premade template not found' });
      }
  
      response.components = premadeTemplate.components;
      response.components.push(premadeTemplate.recipientName);
      response.components.push(premadeTemplate.qrCode);
    } else {

    }

    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

//Get Template
export const handleGetTemplateByProjectId = async (req: Request, res: Response): Promise<Response> => {
  const { projectId } = req.body;

  try{
    if (!req.user || !req.issuerId) {
      return res.status(401).json({ error: 'Unauthorized (user not found)' });
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    const project = await ProjectModel.findById(projectId).exec();

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.issuerId.toString() != req.issuerId) {
      const project = await ProjectModel.findById(projectId).exec();

      return res.status(401).json({ error: 'Unauthorized (issuer not matched)' });
    }

    if (project.stage === 'PROJECT_CREATED') {
      return res.status(404).json({ error: 'Template not found.' });
    } else if (project.stage === 'TEMPLATE_SELECTED' && project.modifiedTemplateId) {
      const modifiedTemplate = await ModifiedTemplateModel.findById(project.modifiedTemplateId);

      if (!modifiedTemplate) {
        return res.status(404).json({ error: 'Modified template not found.' });
      }
  
      const components: Component[] = modifiedTemplate.components;
      components.push(modifiedTemplate.recipientName);
      components.push(modifiedTemplate.qrCode);

      return res.status(200).json({ components });
    } else if (project.stage === 'TEMPLATE_SELECTED') {
      const premadeTemplate = await PremadeTemplateModel.findById(project.templateId);

      if (!premadeTemplate) {
        return res.status(404).json({ error: 'Premade template not found' });
      }
  
      const components: Component[] = premadeTemplate.components;
      components.push(premadeTemplate.recipientName);
      components.push(premadeTemplate.qrCode);
  
      return res.status(200).json({ components });
    } else {
      return res.status(400).json({ error: "You can't get the template at this stage." });
    }

  } catch (error) {
    if (error instanceof mongoose.Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

//Update
export const handleUpdateProjectById = async (req: Request, res: Response): Promise<Response> => {
  const { projectId, projectName, category } = req.body;

  try {
    if (!req.user || !req.issuerId) {
      return res.status(401).json({ error: 'Unauthorized (user not found)' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    const Project = await ProjectModel.find({ issuerId: req.issuerId, projectName: projectName, category: category }).exec();

    if (Project.length !== 0) {
      return res.json({ error: 'A project with this name already exists in this category'});
    }

    const project = await ProjectModel.findById(projectId).exec();

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.issuerId.toString() != req.issuerId) {
      return res.status(401).json({ error: 'Unauthorized (issuer not matched)' });
    }

    const updatedProject = await ProjectModel.findByIdAndUpdate(
      projectId,
      { projectName: projectName, category: category },
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

//Select Template
export const handleSelectPremadeTemplate = async (req: Request, res: Response): Promise<Response> => {
  const { projectId, premadeTemplateId } = req.body;

  try {
    if (!req.user || !req.issuerId) {
      return res.status(401).json({ error: 'Unauthorised (user not found)' });
    }

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

    if (project.issuerId.toString() != req.issuerId) {
      return res.status(401).json({ error: 'Unauthorised (issuer not matched)' });
    }

    if(project.stage !== 'PROJECT_CREATED') {
      return res.status(400).json({ error: 'A template is already selected for this project' });
    }

    const updatedProject = await ProjectModel.findByIdAndUpdate(
      projectId,
      { templateId: premadeTemplateId, stage: 'TEMPLATE_SELECTED' },
      { new: true }
    ).exec();

    return res.status(200).json({ message: 'Premade template added successfully.' });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

//Delete
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
