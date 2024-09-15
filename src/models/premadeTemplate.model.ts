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
  
interface PremadeTemplate extends Document {
    recipientName: Component;
    qrCode: Component;
    components: Component[];
    templateImageURL: string;
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
  
const premadeTemplateSchema = new Schema<PremadeTemplate>({
    recipientName: {
        type: componentSchema,
        required: true
    },
    qrCode: {
        type: componentSchema,
        required: true
    },
    components: [componentSchema],
    templateImageURL: {
        type: String,
        required: true
    }
},
{ timestamps: true }
);

const PremadeTemplateModel = mongoose.model<PremadeTemplate>('premadeTemplate', premadeTemplateSchema);

export { PremadeTemplateModel, Component, PremadeTemplate };
