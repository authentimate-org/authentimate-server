import mongoose, { Schema, Document } from 'mongoose';

interface Component {
    id: number;
    name: string;
    type: string;
    z_index: number;
    left?: number;
    top?: number;
    opacity?: number;
    rotate?: number;
    width?: number;
    height?: number;
    padding?: number;
    font?: string;
    fontFamily?: string;
    lineHeight?: number;
    title?: string;
    weight?: number;
    color?: string;
    radius?: number;
    image?: string;
}
  
interface ModifiedTemplate extends Document {
    projectId: mongoose.Schema.Types.ObjectId;
    issuerId: mongoose.Schema.Types.ObjectId;
    recipientName: Component;
    qrCode: Component;
    components: Component[];
}
  
const componentSchema = new Schema<Component>({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    z_index: {
        type: Number,
        required: true
    },
    left: Number,
    top: Number,
    opacity: Number,
    rotate: Number,
    width: Number,
    height: Number,
    padding: Number,
    font: String,
    fontFamily: String,
    lineHeight: Number,
    title: String,
    weight: Number,
    color: String,
    radius: Number,
    image: String
});
  
const modifiedTemplateSchema = new Schema<ModifiedTemplate>({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project',
        required: true
    },
    issuerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'issuer',
        required: true
    },
    recipientName: {
        type: componentSchema,
        required: true
    },
    qrCode: {
        type: componentSchema,
        required: true
    },
    components: [componentSchema]
},
{ timestamps: true }
);

const ModifiedTemplateModel = mongoose.model<ModifiedTemplate>('modifiedTemplate', modifiedTemplateSchema);

export { ModifiedTemplateModel, Component };
