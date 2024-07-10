import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { PremadeTemplateModel, Text, GraphicElement, Image } from '../models/premadeTemplate.model'

//Create
export const handleCreatePremadeTemplate = async (req: Request, res: Response): Promise<Response> => {
  // const { texts, recipientName, graphicElements, bgColor, templateImageURL } = req.body;

  try {
    // const { design, image } = req.body;
    const { design } = req.body;
    const designObject = JSON.parse(design);
    const image = "https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/img/car_4.png";
    const recipientName = designObject.design.find((elem: any) => elem.type === 'recipientName') as Text;
    const qrcode = designObject.design.find((elem: any) => elem.type === 'qrcode') as GraphicElement;
    const graphicElements = designObject.design.filter((elem: any) => elem.name === 'shape') as GraphicElement[];
    const images = designObject.design.filter((elem: any) => elem.name === 'image') as Image[];
    const texts = designObject.design.filter((elem: any) => elem.name === 'text') as Text[];

    const newPremadeTemplate = new PremadeTemplateModel({
      recipientName,
      qrcode,
      components: {
        graphicElements,
        images,
        texts
      },
      templateImageURL: image
    });
    // const newPremadeTemplate: PremadeTemplate = {
    //   texts,
    //   recipientName,
    //   graphicElements,
    //   bgColor,
    //   templateImageURL
    // };

    // const createdPremadeTemplate = new PremadeTemplateModel(newPremadeTemplate);
    // await createdPremadeTemplate.save();

    await newPremadeTemplate.save();

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
export const handleGetAllPremadeTemplates = async (req: Request, res: Response): Promise<Response> => {
  try {
    const allPremadeTemplates = await PremadeTemplateModel.find({}, '_id templateImageURL').exec();

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
      return res.status(400).json({ error: 'Invalid premade template ID' });
    }

    const premadeTemplate = await PremadeTemplateModel.findById(premadeTemplateId);

    if (!premadeTemplate) {
      return res.status(404).json({ error: 'Premade template not found' });
    }

    const response = {
      _id: premadeTemplate._id,
      components: [
        premadeTemplate.recipientName,
        premadeTemplate.qrcode,
        ...premadeTemplate.components.graphicElements,
        ...premadeTemplate.components.images,
        ...premadeTemplate.components.texts
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

