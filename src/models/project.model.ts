import mongoose, { Document, Schema } from 'mongoose';

interface Project extends Document {
  projectName: string;
  category: 'EVENT' | 'COURSE' | 'COMPETITION';
  issuerId: mongoose.Types.ObjectId;
  templateId?: mongoose.Types.ObjectId;
  modifiedTemplateId?: mongoose.Types.ObjectId;
  issuedCertificates: mongoose.Types.ObjectId[];
  stage: 'PROJECT_CREATED' | 'TEMPLATE_SELECTED' | 'TEMPLATE_FINALISED' | 'ISSUED';
}

const projectSchema = new Schema<Project>({
  projectName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ["EVENT", "COURSE", "COMPETITION"],
    required: true
  },
  issuerId: {
    type: Schema.Types.ObjectId,
    ref: 'issuer',
    required: true
  },
  templateId: {
    type: Schema.Types.ObjectId,
    ref: 'premadeTemplate'
  },
  modifiedTemplateId: {
    type: Schema.Types.ObjectId,
    ref: 'modifiedTemplate'
  },
  issuedCertificates: [{
    type: Schema.Types.ObjectId,
    ref: 'certification',
    default: []
  }],
  stage: {
    type: String,
    enum: ["PROJECT_CREATED", "TEMPLATE_SELECTED", "TEMPLATE_FINALISED", "ISSUED"],
    default: "PROJECT_CREATED",
    required: true
  }
});

const projectModel = mongoose.model<Project>('project', projectSchema);
export { Project, projectModel };
