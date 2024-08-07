<<<<<<< HEAD
import { Request, Response } from 'express';
import { premadeTemplate, PremadeTemplateModel } from '../models/premadeTemplate.model';
import mongoose from 'mongoose';
=======
import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { PremadeTemplateModel, Component } from '../models/premadeTemplate.model'


>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73

//Create
export const handleCreatePremadeTemplate = async (req: Request, res: Response): Promise<Response> => {
  try {
    // const { imageURL } = req.body;
    const components = JSON.parse(req.body.design).design;
    // console.log(components);
    const imageURL = "https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/img/car_4.png";
    let recipientName: Component | null = null;
    let qrCode: Component | null = null;

<<<<<<< HEAD
    const newPremadeTemplate: premadeTemplate = {
      texts,
      recipientName,
      graphicElements,
      bgColor,
      templateImageURL
    };

    const createdPremadeTemplate = new PremadeTemplateModel(newPremadeTemplate);
    await createdPremadeTemplate.save();

    res.status(201).json(createdPremadeTemplate);
  } catch (error) {
      if (error instanceof mongoose.Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
=======
    for (let i = 0; i < components.length; i++) {
      if(recipientName === null || qrCode === null) {
        if (components[i].type === 'recipientName') {
          recipientName = components.splice(i, 1)[0];
          i--;
        } else if (components[i].type === 'qrCode') {
          qrCode = components.splice(i, 1)[0];
          i--;
        }
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73
      }
      else break; //Need optimization
    }

    const newPremadeTemplate = new PremadeTemplateModel({
      recipientName,
      qrCode,
      components,
      templateImageURL: imageURL
    });

    await newPremadeTemplate.save();

    return res.status(201).json({ message: "Premade template created successfully." });
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
<<<<<<< HEAD
    const allPremadeTemplates = await PremadeTemplateModel.find({});
    console.log(allPremadeTemplates)
    res.status(200).json(allPremadeTemplates);
  } catch (error) {
      if (error instanceof mongoose.Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
=======
    const allPremadeTemplates = await PremadeTemplateModel.find({}, '_id templateImageURL').exec();

    if (!allPremadeTemplates) {
      return res.status(404).json({ error: 'Premade templates not found' });
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73
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
<<<<<<< HEAD
    const { premadeTemplateId } = req.body;
    console.log(premadeTemplateId)
=======
    if (!mongoose.Types.ObjectId.isValid(premadeTemplateId)) {
      return res.status(400).json({ error: 'Invalid premade template ID' });
    }

>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73
    const premadeTemplate = await PremadeTemplateModel.findById(premadeTemplateId);

    if (!premadeTemplate) {
      return res.status(404).json({ error: 'Premade template not found' });
    }

    const components: Component[] = premadeTemplate.components;
    components.push(premadeTemplate.recipientName);
    components.push(premadeTemplate.qrCode);

    return res.status(200).json({ components: components });
    // return res.status(200).json(premadeTemplate);
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

//Delete
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

