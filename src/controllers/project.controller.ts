import { Request, Response } from 'express';
import { IssuerModel, Issuer } from '../models/issuer.model';
import { Project, projectModel } from '../models/project.model';
import mongoose from 'mongoose';
import { modifiedTemplateModel } from '../models/modifiedTemplate.model';
import { recipientModel } from '../models/recipient.model';
import { certificationModel, certification } from '../models/certification.model';
import { premadeTemplateModel } from '../models/premadeTemplate.model';

// Create
export const handleCreateProject = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { projectName, category } = req.body;

    console.log(req.issuerId)
    if (!req.user || !req.issuerId) {
      return res.status(401).json({ error: 'Unauthorized (user not found)' });
    }

    const newProject: Project = new projectModel({
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
// export const handleGetAllProjectsByIssuerId = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const issuerId = req.params.issuerId;
  
//     if (!mongoose.Types.ObjectId.isValid(issuerId)) {
//       res.status(400).json({ error: 'Invalid issuer ID' });
//       return;
//     }
  
//     const allProjects = await projectModel.find({issuerId: issuerId}).exec();
  
//     if (!allProjects) {
//       res.status(404).json({ error: 'Projects not found' });
//       return;
//     }
  
//     res.json(allProjects);
//   } catch (error) {
//       if (error instanceof mongoose.Error) {
//         res.status(400).json({ error: error.message });
//       } else {
//         res.status(500).json({ error: 'Internal server error' });
//       }
//     }
// };

// //Read One
// export const handleGetProjectById = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const projectId = req.params.projectId;

//     if (!mongoose.Types.ObjectId.isValid(projectId)) {
//       res.status(400).json({ error: 'Invalid project ID' });
//       return;
//     }

//     const project = await projectModel.findById(projectId).exec();

//     if (!project) {
//       res.status(404).json({ error: 'Project not found' });
//       return;
//     }

//     res.json(project);
//   } catch (error) {
//       if (error instanceof mongoose.Error) {
//         res.status(400).json({ error: error.message });
//       } else {
//         res.status(500).json({ error: 'Internal server error' });
//       }
//     }
// };

// //Update
// export const handleUpdateProjectById = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { projectId, premadeTemplateId } = req.params;
//     const updateData = req.body;

//     if (!mongoose.Types.ObjectId.isValid(projectId)) {
//       res.status(400).json({ error: 'Invalid project ID' });
//       return;
//     }

//     const updatedProject = await projectModel.findByIdAndUpdate(projectId, updateData, { new: true }).exec();

//     if (!updatedProject) {
//       res.status(404).json({ error: 'Project not found' });
//       return;
//     }

//     res.json(updatedProject);
//   } catch (error) {
//       if (error instanceof mongoose.Error) {
//         res.status(400).json({ error: error.message });
//       } else {
//         res.status(500).json({ error: 'Internal server error' });
//       }
//     }
// };
// export const handleSelectPremadeTemplate = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { projectId, premadeTemplateId } = req.params;


//     if (!mongoose.Types.ObjectId.isValid(projectId)) {
//       res.status(400).json({ error: 'Invalid project ID' });
//       return;
//     }
//     if (!mongoose.Types.ObjectId.isValid(premadeTemplateId)) {
//       res.status(400).json({ error: 'Invalid premade template ID' });
//       return;
//     }

//     const premadeTemplate = await premadeTemplateModel.findById(premadeTemplateId);

//     if (!premadeTemplate) {
//       res.status(404).json({ error: 'Premade template not found' });
//       return;
//     }

//     const project =  await projectModel.findById(projectId).exec();

//     if (!project) {
//       res.status(404).json({ error: 'Project not found' });
//       return ;
//     }
//     if(project.stage !== 'PROJECT_CREATED') {
//       res.json({ message: 'A template is already selected for this project' });
//       return ;
//     }

//     const updatedProject = await projectModel.findByIdAndUpdate(projectId, { templateId: premadeTemplateId , stage: 'TEMPLATE_SELECTED'}, { new: true }).exec();

//     res.json(updatedProject);
//   } catch (error) {
//       if (error instanceof mongoose.Error) {
//         res.status(400).json({ error: error.message });
//       } else {
//         res.status(500).json({ error: 'Internal server error' });
//       }
//     }
// };
// export const handleRemovePremadeTemplate = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { projectId, premadeTemplateId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(projectId)) {
//       res.status(400).json({ error: 'Invalid project ID' });
//       return;
//     }
//     if (!mongoose.Types.ObjectId.isValid(premadeTemplateId)) {
//       res.status(400).json({ error: 'Invalid premade template ID' });
//       return;
//     }

//     const premadeTemplate = await premadeTemplateModel.findById(premadeTemplateId);

//     if (!premadeTemplate) {
//       res.status(404).json({ error: 'Premade template not found' });
//       return;
//     }

//     const project =  await projectModel.findById(projectId).exec();

//     if (!project) {
//       res.status(404).json({ error: 'Project not found' });
//       return;
//     }
//     if(project.stage === 'PROJECT_CREATED') {
//       res.json({ error: 'No template has been selected yet' });
//       return ;
//     }
//     if(project.stage === 'TEMPLATE_SELECTED' && premadeTemplateId !== project.templateId.toString()) {
//       res.json({ error: 'Template ID did not match'});
//       return ;
//     }
//     if(project.stage === 'TEMPLATE_FINALISED' || project.stage === 'ISSUED') {
//       res.json({ message: 'You cannot remove the template at this stage' });
//       return ;
//     }

//     const updatedProject = await projectModel.findByIdAndUpdate(projectId, { templateId: null , stage: 'PROJECT_CREATED'}, { new: true }).exec();

//     res.json(updatedProject);
//   } catch (error) {
//       if (error instanceof mongoose.Error) {
//         res.status(400).json({ error: error.message });
//       } else {
//         res.status(500).json({ error: 'Internal server error' });
//       }
//     }
// };

// //Delete
// export const handleDeleteProjectById = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const projectId = req.params.projectId;

//     if (!mongoose.Types.ObjectId.isValid(projectId)) {
//       res.status(400).json({ error: 'Invalid project ID' });
//       return;
//     }

//     const project = await projectModel.findById(projectId);

//     if (!project) {
//       res.status(404).json({ error: 'Project not found' });
//       return;
//     }

//     await modifiedTemplateModel.findByIdAndDelete(project.modifiedTemplateId);

//     await recipientModel.deleteMany({ projectId: projectId });

//     await certificationModel.deleteMany({ projectId: projectId });

//     await issuerModel.findByIdAndUpdate(project.issuerId, { $pull: { createdProjects: projectId } }, { new: true }).exec();

//     await projectModel.findByIdAndDelete(projectId).exec();

//     res.json({ message: 'Project deleted successfully' });
//   } catch (error) {
//     if (error instanceof mongoose.Error) {
//       res.status(400).json({ error: error.message });
//     } else {
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }
// };
