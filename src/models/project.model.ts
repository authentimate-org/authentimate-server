import mongoose, { Document, Schema } from 'mongoose';

interface Project extends Document {
  projectName: string;
  category: 'EVENT' | 'COURSE' | 'COMPETITION';
  issuerId: mongoose.Types.ObjectId;
  templateId?: mongoose.Types.ObjectId;
  modifiedTemplateId?: mongoose.Types.ObjectId;
  issuedCertifications: mongoose.Types.ObjectId[];
  stage: 'PROJECT_CREATED' | 'TEMPLATE_SELECTED' | 'TEMPLATE_FINALISED' | 'CERTIFICATION_CREATED' | 'MAIL_SENT' | 'MAIL_NOT_SENT';
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
  issuedCertifications: [{
    type: Schema.Types.ObjectId,
    ref: 'certification',
    default: []
  }],
  stage: {
    type: String,
    enum: ["PROJECT_CREATED", "TEMPLATE_SELECTED", "TEMPLATE_FINALISED", "CERTIFICATION_CREATED", "MAIL_SENT", "MAIL_NOT_SENT"],
    default: "PROJECT_CREATED",
    required: true
  }
},
{ timestamps: true }
);

const ProjectModel = mongoose.model<Project>('project', projectSchema);
export { Project, ProjectModel };
