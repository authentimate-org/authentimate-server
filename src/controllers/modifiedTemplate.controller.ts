import { Request, Response } from 'express'
import mongoose from 'mongoose'
import multer from 'multer';
import { ProjectModel } from '../models/project.model'
import { ModifiedTemplateModel, Text, GraphicElement, Image } from '../models/modifiedTemplate.model'


//Save
export const handleSaveModifiedTemplate = async (req: Request, res: Response): Promise<Response> => {
  try{
    // const { projectId, design } = req.body;
    const { design } = req.body;
    const designObject = JSON.parse(design);
    const recipientName = designObject.design.find((elem: any) => elem.type === 'recipientName') as Text;
    const qrcode = designObject.design.find((elem: any) => elem.type === 'qrcode') as GraphicElement;
    const graphicElements = designObject.design.filter((elem: any) => elem.name === 'shape' || elem.name === 'main_frame') as GraphicElement[];
    const images = designObject.design.filter((elem: any) => elem.name === 'image' && elem.type !== 'qrcode') as Image[];
    const texts = designObject.design.filter((elem: any) => elem.name === 'text' && elem.type !== 'recipientName') as Text[];
  
    const projectId = "668e2704696681865e92351a";

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
        components: {
          graphicElements,
          images,
          texts
        }
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
          components: {
            graphicElements,
            images,
            texts
          }
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
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
//Create
export const handleCreateModifiedTemplate = async (req: Request, res: Response): Promise<Response> => {
  // const { texts, recipientName, graphicElements, bgColor } = req.body;

  // const { projectId, design } = req.body;
  const { design } = req.body;
  const designObject = JSON.parse(design);
  const recipientName = designObject.design.find((elem: any) => elem.type === 'recipientName') as Text;
  const qrcode = designObject.design.find((elem: any) => elem.type === 'qrcode') as GraphicElement;
  const graphicElements = designObject.design.filter((elem: any) => elem.name === 'shape') as GraphicElement[];
  const images = designObject.design.filter((elem: any) => elem.name === 'image') as Image[];
  const texts = designObject.design.filter((elem: any) => elem.name === 'text') as Text[];

  const projectId = "668d6d6a067f9213c96f5ed6";

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
      return res.json({ error: 'A template is already modified for this project' });
    }

    // const newModifiedTemplate: ModifiedTemplate = {
    //   projectId,
    //   templateId: premadeTemplateId,
    //   texts,
    //   recipientName,
    //   graphicElements: designObject.design,
    //   bgColor
    // };
    const newModifiedTemplate = new ModifiedTemplateModel({
      projectId,
      issuerId: req.issuerId,
      recipientName,
      qrcode,
      components: {
        graphicElements,
        images,
        texts
      }
    });

    // const createdModifiedTemplate = new ModifiedTemplateModel(newModifiedTemplate);
    await newModifiedTemplate.save();

    await ProjectModel.findByIdAndUpdate(
      projectId,
      { modifiedTemplateId: newModifiedTemplate._id, stage: 'TEMPLATE_FINALISED' },
      { new: true }
    ).exec();

    return res.status(201).json({ message: "Template saved." });
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

    const response = {
      _id: modifiedTemplate._id,
      components: [
        modifiedTemplate.recipientName,
        modifiedTemplate.qrcode,
        ...modifiedTemplate.components.graphicElements,
        ...modifiedTemplate.components.images,
        ...modifiedTemplate.components.texts
      ]
    };

    return res.status(200).json(response);
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
  // const { modifiedTemplateId, texts, recipientName, graphicElements, bgColor } = req.body;

    // const { projectId, design } = req.body;
    const { design } = req.body;
    const designObject = JSON.parse(design);
    const recipientName = designObject.design.find((elem: any) => elem.type === 'recipientName') as Text;
    const qrcode = designObject.design.find((elem: any) => elem.type === 'qrcode') as GraphicElement;
    const graphicElements = designObject.design.filter((elem: any) => elem.name === 'shape') as GraphicElement[];
    const images = designObject.design.filter((elem: any) => elem.name === 'image') as Image[];
    const texts = designObject.design.filter((elem: any) => elem.name === 'text') as Text[];
  
    const projectId = "668d6d6a067f9213c96f5ed6";

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
    
    const modifiedTemplateId = project.modifiedTemplateId;

    if (!modifiedTemplateId) {
      return res.json({ error: 'Modified template not found.' });
    }

    if(project.stage === 'ISSUED') {
      return res.json({ error: "You can't save the template at this stage." });
    }

    const updatedModifiedTemplate = await ModifiedTemplateModel.findByIdAndUpdate(
      modifiedTemplateId,
      { recipientName,
        qrcode,
        components: {
          graphicElements,
          images,
          texts
        }
      },
      { new: true }
    );
    
    if (!updatedModifiedTemplate) {
      return res.status(404).json({ error: 'Modified template not found' });
    }

    return res.status(200).json({ message: "Template saved." });
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
